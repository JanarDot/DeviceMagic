// Motion detector — mirrors MotionDetector.swift from the iOS app.
// Listens to the phone accelerometer and fires a callback when a spell gesture is detected.

class MotionEngine {
  constructor(onGesture) {
    this.onGesture = onGesture;
    this.lastTriggerTime = 0;

    // Threshold: 20 m/s² ≈ 2.0g — same sensitivity as the iOS app.
    // Both iOS CMAccelerometerData and the web DeviceMotionEvent include gravity,
    // so the conversion is simply: iOS threshold (2.0g) × 9.8 = 19.6 m/s².
    this.THRESHOLD = 20;

    // 3000ms cooldown between spells — matches the 3.0s cooldown in MotionDetector.swift.
    this.COOLDOWN = 3000;

    // Bind the handler so we can remove it cleanly in stop()
    this._boundHandler = this._handleMotion.bind(this);
  }

  // Requests motion permission if needed, then resolves true/false.
  // Must be called from inside a user tap event — iOS 13+ requires this.
  // Android and desktop skip the permission step entirely.
  async requestPermission() {
    if (typeof DeviceMotionEvent === 'undefined') {
      // Desktop or old browser with no accelerometer
      return false;
    }
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS 13+ path — triggers the native permission dialog
      try {
        const result = await DeviceMotionEvent.requestPermission();
        return result === 'granted';
      } catch (e) {
        return false;
      }
    }
    // Android and all other browsers — no permission needed, just proceed
    return true;
  }

  // Starts listening for gestures. Call after requestPermission() resolves true.
  start() {
    window.addEventListener('devicemotion', this._boundHandler);
  }

  // Stops listening. Called when the user toggles monitoring off.
  stop() {
    window.removeEventListener('devicemotion', this._boundHandler);
  }

  _handleMotion(event) {
    const a = event.accelerationIncludingGravity;

    // Guard: some browsers report null values before the sensor warms up
    if (!a || a.x === null || a.y === null || a.z === null) return;

    // Same magnitude formula as MotionDetector.swift: √(x² + y² + z²)
    const magnitude = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);

    if (magnitude < this.THRESHOLD) return;

    // Enforce cooldown — same 3-second gap as the iOS app
    const now = Date.now();
    if (now - this.lastTriggerTime < this.COOLDOWN) return;

    this.lastTriggerTime = now;
    this.onGesture();
  }
}
