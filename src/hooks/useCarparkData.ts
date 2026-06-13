import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchCarparkAvailability, fetchLiveData } from '../api/carparkApi';
import { OFFLINE_POLL_MS, ONLINE_POLL_MS } from '../config';
import { loadCachedData, saveCachedData } from '../storage/cache';
import { AvailabilityMap, Carpark } from '../types';

/**
 * Cache-first data loading: on open, immediately shows the last cached
 * carparks (assuming offline), then pings the backend in the background.
 * A successful ping replaces the displayed data with the fresh copy, saves
 * it to the cache, and marks the app online; a failed ping just leaves the
 * cached copy on screen.
 */
export function useCarparkData() {
  const [allCarparks, setAllCarparks] = useState<Carpark[]>([]);
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [isOffline, setIsOffline] = useState(true);
  const [loadStatus, setLoadStatus] = useState('Loading carparks...');

  // Mirrors of state for the poll loop, so it always sees the latest values
  // without having to be re-created (and re-scheduled) on every update.
  const allCarparksRef = useRef<Carpark[]>([]);
  const isOfflineRef = useRef(true);

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
      console.warn('Failed to load live carpark data:', err);
      setIsOffline(true);
      const cachedCount = allCarparksRef.current.length;
      setLoadStatus(
        cachedCount > 0 ? `${cachedCount} carparks loaded (cached)` : 'Offline and no cached data available'
      );
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

  // Hydrate from cache first (instant, assumed offline), then poll the
  // backend for fresh data. While online, polling just refreshes
  // availability on the normal cadence; while offline, it retries the full
  // load more often so the app recovers as soon as the connection comes back.
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

    const init = async () => {
      const cached = await loadCachedData();
      if (!cancelled && cached.allCarparks) {
        setAllCarparks(cached.allCarparks);
        setAvailability(cached.availability || {});
        setLoadStatus(`${cached.allCarparks.length} carparks loaded (cached)`);
      }
      if (cancelled) return;
      await poll();
    };

    init();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [loadCarparkData, refreshAvailability]);

  return { allCarparks, availability, isOffline, loadStatus };
}
