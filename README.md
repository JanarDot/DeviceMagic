# Device Magic

Device Magic is a browser-first spell-casting experience for phones. Motion gestures trigger spell audio and visual feedback, with native Android and macOS downloads available as secondary options.

## Production

- Live product: <https://janardot.github.io/DeviceMagic/>
- Installation guide: <https://janardot.github.io/DeviceMagic/install.html>
- Public repository: `JanarDot/DeviceMagic`
- Hosting: GitHub Pages from the root of `main`

## Current Releases

| Surface | Current state |
|---|---|
| Browser and iOS/Android PWA | Live, service-worker cache `device-magic-v8` |
| Android native | Version `1.3`, build `4`, signed APK at `downloads/device-magic.apk` |
| macOS menu-bar app | Version `0.4`, build `6`, Apple Silicon ZIP at `downloads/device-magic-mac.zip` |
| Native iOS source | Version `1.3`, build `4`, maintained in the private native repository and not publicly distributed |

The public iOS install path is the Safari Home Screen app. There is currently no public IPA, TestFlight, or App Store download.

## Audio Baseline

All four platforms use the same 36 pristine spell masters. Their average file level is approximately `-16.65 dBFS`, preserving the original dynamics. UI volume controls operate independently from `0` to `100%`; there is no hidden playback-gain multiplier.

## Repository Map

- `index.html`: live browser experience and platform routing
- `install.html`: iOS, Android, and Mac installation guide
- `js/`: browser motion, audio, spell selection, and app state
- `audio/`: case-sensitive production MP3 masters
- `assets/`: app icons and visual assets
- `downloads/`: current Android APK, Mac ZIP, and Mac installer helper
- `manifest.json`: project-relative PWA launch configuration
- `sw.js`: app-shell cache and update lifecycle

Native macOS, iOS, and Android source lives in the private `JanarDot/Device-Magic-Program` repository.

## Local Preview

Serve the repository root so service-worker and relative-path behavior match production:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Publishing

All production changes use a focused branch, pull request to `main`, merge, and verification of the exact GitHub Pages commit. See [PUBLISHING.md](PUBLISHING.md) for the release checklist.
