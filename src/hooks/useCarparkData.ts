import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchCarparkAvailability, fetchLiveData } from '../api/carparkApi';
import { OFFLINE_POLL_MS, ONLINE_POLL_MS } from '../config';
import { loadCachedData, saveCachedData } from '../storage/cache';
import { AvailabilityMap, Carpark } from '../types';

/**
 * Loads carpark details + live availability, polls for updates, and falls
 * back to the last cached copy (via AsyncStorage) whenever the backend is
 * unreachable - mirrors the offline behaviour of the web app.
 */
export function useCarparkData() {
  const [allCarparks, setAllCarparks] = useState<Carpark[]>([]);
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [isOffline, setIsOffline] = useState(false);
  const [loadStatus, setLoadStatus] = useState('Loading carparks...');

  // Mirrors of state for the poll loop, so it always sees the latest values
  // without having to be re-created (and re-scheduled) on every update.
  const allCarparksRef = useRef<Carpark[]>([]);
  const isOfflineRef = useRef(false);

  useEffect(() => {
    allCarparksRef.current = allCarparks;
  }, [allCarparks]);

  useEffect(() => {
    isOfflineRef.current = isOffline;
  }, [isOffline]);

  const loadCarparkData = useCallback(async () => {
    try {
      const data = await fetchLiveData();
      setAllCarparks(data.allCarparks);
      setAvailability(data.availability);
      await saveCachedData(data.allCarparks, data.availability);
      setIsOffline(false);
      setLoadStatus(`${data.allCarparks.length} carparks loaded`);
    } catch (err) {
      console.warn('Failed to load live carpark data, trying cache:', err);
      const cached = await loadCachedData();
      if (cached.allCarparks) {
        setAllCarparks(cached.allCarparks);
        setAvailability(cached.availability || {});
        setIsOffline(true);
        setLoadStatus(`${cached.allCarparks.length} carparks loaded (cached)`);
      } else {
        setIsOffline(true);
        setLoadStatus('Offline and no cached data available');
      }
    }
  }, []);

  const refreshAvailability = useCallback(async () => {
    try {
      const avail = await fetchCarparkAvailability();
      setAvailability(avail);
      await saveCachedData(allCarparksRef.current, avail);
      setIsOffline(false);
    } catch (err) {
      console.warn('Failed to refresh availability:', err);
      setIsOffline(true);
    }
  }, []);

  // Poll the backend for fresh data. While online, this just refreshes
  // availability on the normal cadence; while offline (or before the first
  // successful load), it retries the full load more often so the app
  // recovers as soon as the connection comes back.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      if (isOfflineRef.current || allCarparksRef.current.length === 0) {
        await loadCarparkData();
      } else {
        await refreshAvailability();
      }
      if (cancelled) return;
      timer = setTimeout(poll, isOfflineRef.current ? OFFLINE_POLL_MS : ONLINE_POLL_MS);
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [loadCarparkData, refreshAvailability]);

  return { allCarparks, availability, isOffline, loadStatus };
}
