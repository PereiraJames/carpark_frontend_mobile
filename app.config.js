// app.config.js (instead of app.json) so we can read the Google Maps key
// from .env at config time and share it between Android and iOS.
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

const LOCATION_PERMISSION_MESSAGE = 'Carpark uses your location to show the nearest carparks.';

module.exports = {
  expo: {
    name: 'PearPark',
    slug: 'carpark-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'carpark',
    userInterfaceStyle: 'light',

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.example.carpark_app',
      config: {
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription: LOCATION_PERMISSION_MESSAGE,
      },
    },

    android: {
      package: 'com.example.carpark_app',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY,
        },
      },
    },

    web: {
      favicon: './assets/favicon.png',
    },

    plugins: [
      [
        'expo-location',
        {
          locationWhenInUsePermission: LOCATION_PERMISSION_MESSAGE,
        },
      ],
    ],
  },
};
