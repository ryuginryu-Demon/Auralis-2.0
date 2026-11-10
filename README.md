# Auralis Music

Auralis is an installable, Spotify-inspired music-player prototype for Android browsers.

## What works
- Online audio playback using sample/demo MP3 streams
- Play/pause, previous/next, seek, volume, shuffle and repeat
- Search across the included demo tracks
- Like/unlike tracks
- Local playlist and library persistence using browser storage
- Responsive mobile interface and PWA install support

## Important limitations
This is a functional prototype, not a full Spotify replacement. The included SoundHelix URLs are sample/demo streams, not a commercial music catalogue. A real public streaming service needs a licensed catalogue/provider, API credentials, and provider-specific playback/authentication integration. This build does not include Spotify's catalogue, accounts, recommendations, podcasts, or subscription features.

## Install on Android
1. Put the folder on an HTTPS host (for example, your own web hosting or a static hosting provider).
2. Open the hosted URL in Chrome on Android.
3. Open Chrome's menu and choose **Install app** or **Add to Home screen**.
4. Launch Auralis from your home screen.

A PWA needs HTTPS (or localhost) for service-worker installation. Opening `index.html` directly from a file manager will not provide the full install experience.

## Project files
- `index.html` — interface and styling
- `app.js` — playback and app logic
- `manifest.webmanifest` — install metadata
- `sw.js` — offline shell caching
- `icon.svg` — app icon

## Next production steps
1. Select a licensed music provider and confirm commercial/personal-use terms.
2. Add secure backend authentication and provider token handling.
3. Replace sample tracks with catalogue search, artwork, metadata and stream URLs from that provider.
4. Test background playback, lock-screen controls, audio focus, buffering and device compatibility.
5. Package as a native Android app if APK distribution is required.
