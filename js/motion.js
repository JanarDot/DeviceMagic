// Motion detector — mirrors MotionDetector.swift from the iOS app.
// Listens to the phone accelerometer and fires a callback when a spell gesture is detected.

class MotionEngine {
  constructor(onGesture, onRawMotion) {
    this.onGesture   = onGesture;
    this.onRawMotion = onRawMotion || null; // optional: called on every event for visual feedback
    this.lastTriggerTime = 0;

    // iOS native app uses 20 m/s² (tuned for deliberate pointing-at-Mac gesture).
    // Browser version uses 12 m/s² — a casual wrist flick produces ~12–16 m/s²,
    // so 20 was consistently out of reach for most users.
    this.THRESHOLD = 12;

    // 2000ms cooldown — slightly shorter than the iOS 3s to feel more responsive
    // in a browser context where users are testing by repeated short flicks.
    this.COOLDOWN = 2000;

    // Bind the handler so we can remove it cleanly in stop()
    this._boundHandler = this._handleMotion.bind(this);
  }

  // Returns true if DeviceMotionEvent is supported at all.
  static isSupported() {
    return typeof DeviceMotionEvent !== 'undefined';
  }

  // Requests motion permission if needed, then resolves true/false.
  // Must be called from inside a user tap event — iOS 13+ requires this.
  // Android and desktop skip the permission step entirely.
  async requestPermission() {
    if (!MotionEngine.isSupported()) {
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

    // Fire raw motion callback on every event so the UI can show the sensor is working
    if (this.onRawMotion) {
      this.onRawMotion(magnitude);
    }

    if (magnitude < this.THRESHOLD) return;

    // Enforce cooldown
    const now = Date.now();
    if (now - this.lastTriggerTime < this.COOLDOWN) return;

    this.lastTriggerTime = now;
    this.onGesture();
  }
}
