# Publishing Device Magic

## Production Topology

The public `JanarDot/DeviceMagic` repository deploys directly from the root of `main` through GitHub Pages. There is no application build command for the static browser product.

- Production: <https://janardot.github.io/DeviceMagic/>
- Install guide: <https://janardot.github.io/DeviceMagic/install.html>
- Android APK: <https://janardot.github.io/DeviceMagic/downloads/device-magic.apk>
- Mac ZIP: <https://janardot.github.io/DeviceMagic/downloads/device-magic-mac.zip>

Native source and release builds come from the private `JanarDot/Device-Magic-Program` repository.

## Current Release Set

- Browser/PWA cache: `device-magic-v8`
- Android: version `1.3`, build `4`
- macOS: version `0.4`, build `6`
- Native iOS source: version `1.3`, build `4`
- Audio: 36 shared pristine masters, approximately `-16.65 dBFS` average file level

The public iOS path is Safari Home Screen installation through `install.html#ios`. No public native iOS binary is linked.

## Release Checklist

1. Start clean branches from the current `main` of both repositories.
2. Make native changes in the private repository and browser changes in the public repository.
3. Keep all 36 audio files byte-identical across browser, macOS, iOS, and Android when a synchronized audio release is requested.
4. Keep file mastering separate from UI volume control. Do not add a hidden playback-gain multiplier to compensate for incorrectly mastered files.
5. Bump Android `versionCode` and `versionName`, iOS build and marketing versions, and macOS bundle build and version for new distributables.
6. Regenerate the iOS Xcode project after editing `iOS/project.yml`.
7. Build and verify the signed Android release APK and packaged Mac ZIP.
8. Copy the verified artifacts to `downloads/device-magic.apk` and `downloads/device-magic-mac.zip`.
9. Bump the service-worker cache name whenever production audio or cached app-shell files change.
10. Run JavaScript syntax checks, package checks, signing continuity checks, and cross-platform audio parity checks.
11. Commit explicit files, open pull requests, and merge only through the repository workflow.
12. Wait for the GitHub Pages build that names the exact public merge commit.
13. Verify the live browser code, cache version, installation page, and Android, Mac, and iOS links.

## Required Browser Checks

```bash
node --check js/app.js
node --check js/audio.js
node --check js/motion.js
node --check js/spells.js
node --check sw.js
git diff --check
```

Spell selection behavior, weights, filenames, and the every-25th-real-flick Muggle rule must remain unchanged unless the release explicitly changes them.
