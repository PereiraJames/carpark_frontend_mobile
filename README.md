# Carpark Mobile (Expo / React Native)

React Native rewrite of the Carpark map app, built with Expo so it can be
tested instantly via **Expo Go** and later built for both Android and iOS.

It talks to the same Flask backend (`carpark_app/`) as the web app
(`templates/map.html`) and the old Capacitor app (`mobile/`) - no backend
changes were needed.

## Project structure

```
mobile-expo/
├── App.tsx                     - app entry point (wraps MapScreen)
├── app.config.js               - Expo config (permissions, Maps API key, bundle ids)
├── .env                        - local config (API base URL, Maps API key) - gitignored
├── .env.example                - template for .env
└── src/
    ├── config.ts                - constants (API base URL, poll intervals, colours)
    ├── types.ts                 - shared TypeScript types for API responses
    ├── api/
    │   └── carparkApi.ts         - fetches /api/carpark_details, /api/carpark_availability, geocoding
    ├── storage/
    │   └── cache.ts              - AsyncStorage read/write for offline fallback
    ├── hooks/
    │   ├── useCarparkData.ts     - loads + polls carpark data, online/offline state
    │   └── useUserLocation.ts    - wraps expo-location permission + GPS fix
    ├── utils/
    │   ├── distance.ts           - haversine distance
    │   └── availability.ts       - lot availability -> marker colour/summary
    ├── components/
    │   ├── CarparkMap.tsx         - MapView + carpark/user/destination markers
    │   ├── SearchBar.tsx          - destination search box
    │   ├── ControlButtons.tsx     - "My Location" / "Show All"/"Nearest 10"
    │   ├── StatusPill.tsx         - status text (loading/locating/offline messages)
    │   ├── OfflineBanner.tsx      - red "Offline Mode" banner
    │   ├── Legend.tsx             - availability/type colour legend
    │   └── CarparkDetailsSheet.tsx- bottom sheet shown when a marker is tapped
    └── screens/
        └── MapScreen.tsx          - wires everything together (the old index.html's <script>)
```

## One-time setup

```bash
cd mobile-expo
npm install
cp .env.example .env   # already done; edit if the backend IP or Maps key changes
```

`.env` holds:

- `EXPO_PUBLIC_API_BASE_URL` - the Flask backend's LAN URL (same as `API_BASE`
  in `mobile/www/index.html`)
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` - same Google Maps key used elsewhere in
  this project

Both are inlined into the JS bundle at build/start time (the `EXPO_PUBLIC_`
prefix is how Expo exposes env vars to app code).

## Running with Expo Go (Android, day-to-day testing)

1. Start the Flask backend on this PC: `python app.py`
2. Make sure your phone is on the same Wi-Fi network as this PC.
3. From `mobile-expo/`:
   ```bash
   npx expo start
   ```
4. Scan the QR code with the **Expo Go** app on your phone.

Editing any file under `src/` or `App.tsx` hot-reloads on the phone
immediately - no rebuild, no adb, no emulator.

### Maps API key in Expo Go

`react-native-maps` works in Expo Go on Android out of the box - Expo Go ships
with its own Google Maps key for development. The key in `.env` /
`app.config.js` is only used for:

- **Geocoding** (`geocodeAddress` in `src/api/carparkApi.ts`) - this calls the
  Google Geocoding REST API directly and works in Expo Go today.
- **Production builds** - once you build a standalone APK/IPA (via
  `expo prebuild` + EAS or local builds), `app.config.js`'s
  `android.config.googleMaps.apiKey` / `ios.config.googleMapsApiKey` apply and
  must be your own key.

## iOS

`app.config.js` already sets `ios.bundleIdentifier`,
`ios.config.googleMapsApiKey`, and the location-permission usage string, so
the same source should run on iOS once you have a Mac:

```bash
npx expo start   # scan with Expo Go on iPhone (uses Apple Maps by default)
```

Note: in Expo Go, iOS maps render with Apple Maps (`PROVIDER_DEFAULT`)
regardless of the Google Maps key, since installing a custom native maps
provider requires a dev build. `src/components/CarparkMap.tsx` already only
requests `PROVIDER_GOOGLE` on Android (`Platform.OS === 'android'`) for this
reason - on iOS it falls back to Apple Maps. Carpark markers, colours,
search, and the details sheet behave identically.

## Feature parity with the old web/Capacitor app

- Map centred on Singapore, carpark markers coloured by live availability
  (green/orange/red/grey) with a border colour by type (HDB/LTA)
- "My Location" button (GPS fix via `expo-location`)
- "Show All" / "Nearest 10" toggle, defaulting to nearest-10 around the user
- Destination search (address or postal code) via Google Geocoding, which
  re-centers the map and filters to the 10 nearest carparks to that point
- Tapping a marker opens a details sheet (carpark name, type, postal code,
  rates, live lot counts, and a "Navigate" button that opens Google Maps
  turn-by-turn directions)
- Legend for availability/type colours
- Online polling (availability every 60s) and offline polling (full reload
  every 10s), with an AsyncStorage cache used whenever the backend is
  unreachable, plus an "Offline Mode" banner

## Differences from the web/Capacitor version

- **Marker popups -> bottom sheet.** The web app showed an `InfoWindow`
  popup anchored to the marker. On a touchscreen this is fiddly, so tapping a
  marker here opens a `CarparkDetailsSheet` modal instead - same information,
  easier to read and tap.
- **"Show All" with many markers.** Markers use custom React Native views
  (colour-coded circles) rather than Google Maps JS symbols. If "Show All"
  feels slow with a few thousand carparks, consider adding marker clustering
  (e.g. `react-native-maps` + a clustering library) - not needed for the
  nearest-10 default view.

## Changing the backend IP or Maps key

Edit `.env` (`EXPO_PUBLIC_API_BASE_URL` / `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`)
and restart `npx expo start`. No native rebuild needed for Expo Go testing.
