# API_LEVEL 4.2 Features & Optimizations

This app targets **API_LEVEL 4.2** while maintaining compatibility with **API_LEVEL 3.7+** (original Amazfit Balance).

## Current Features Used

### From API_LEVEL 3.7+ (Base Support)

1. **UI System**
   - `@zos/ui` - Widget creation (TEXT, BUTTON, FILL_RECT)
   - Layout alignment and styling
   - Touch event handling

2. **Storage**
   - `@zos/storage` - localStorage for persistent data
   - JSON serialization for complex objects

3. **Sensors**
   - `@zos/sensor` - Vibrator for alarm notifications
   - Vibration patterns and control

4. **Alarms**
   - `@zos/alarm` - System alarm scheduling
   - Repeat patterns (daily/weekly)
   - Alarm callbacks

5. **Networking**
   - `@zos/http` - HTTP requests for server sync
   - JSON data exchange

6. **Navigation**
   - `@zos/router` - Page navigation and parameters
   - Back navigation

## API_LEVEL 4.2 Enhancements (Future Optimization)

While the app currently works on 3.7+, these 4.2 features can be added:

### 1. Custom Keyboard Integration

**Potential Use**: Question text input on watch

```javascript
import { Keyboard } from '@zos/keyboard';

const keyboard = new Keyboard();
keyboard.open({
  inputType: 'text',
  placeholder: 'Enter question',
  onConfirm: (text) => {
    // Add question directly from watch
  }
});
```

**Benefits**:
- Add/edit questions directly on watch
- No need for Zepp app or server to manage questions
- Better user experience

### 2. Enhanced Device Info

**Potential Use**: Better device identification for sync

```javascript
import { getDeviceInfo } from '@zos/device';

const deviceInfo = getDeviceInfo();
const uuid = deviceInfo.uuid; // Unique device UUID (4.2+)
```

**Benefits**:
- More reliable device identification
- Better multi-device sync support
- Replace generated device_id with hardware UUID

### 3. Improved Multimedia APIs

**Potential Use**: Audio feedback for alarms

```javascript
import { Audio } from '@zos/media';

const audio = new Audio({
  type: 'alarm',
  loop: true
});
audio.play();
```

**Benefits**:
- Sound alerts in addition to vibration
- Different sounds for different alarm types
- Better accessibility

### 4. Workout Integration (Future Feature)

**Potential Use**: Habit tracking integration

```javascript
import { Workout } from '@zos/workout';

// Track exercise-related questions
const workout = Workout.getCurrentWorkout();
if (workout) {
  // Bonus points for answering during workout
}
```

## Performance Optimizations for 4.2

### 1. Lazy Loading

Current implementation loads all questions upfront. With 4.2, we can:

```javascript
// Lazy load questions as needed
const loadQuestion = async (id) => {
  return storage.get(`question_${id}`);
};
```

### 2. Background Sync

Use background tasks for server sync:

```javascript
import { BackgroundTask } from '@zos/background';

BackgroundTask.create({
  interval: 3600000, // 1 hour
  task: () => {
    syncFullHistory();
  }
});
```

### 3. Better Memory Management

Destroy widgets properly to prevent memory leaks:

```javascript
Page({
  widgets: [],
  
  onDestroy() {
    this.widgets.forEach(w => w.destroy());
    this.widgets = [];
  }
});
```

## Migration Path

To fully leverage 4.2:

1. **Phase 1** (Current): Support 3.7+ for maximum compatibility
2. **Phase 2**: Add 4.2 features with runtime detection
3. **Phase 3**: Require 4.2 for new features only

### Runtime API Detection

```javascript
const API_LEVEL = hmSetting.getApiLevel ? hmSetting.getApiLevel() : 3.7;

if (API_LEVEL >= 4.2) {
  // Use keyboard for input
  enableKeyboardInput();
} else {
  // Fallback to Zepp app configuration
  showConfigInstructions();
}
```

## Recommended Next Steps

1. Test thoroughly on Amazfit Balance (3.7) and Balance 2 (4.2)
2. Add keyboard support for 4.2+ devices
3. Implement background sync
4. Add audio alerts option
5. Use hardware UUID for device identification

## Resources

- [Zepp OS API Documentation](https://docs.zepp.com/docs/reference/)
- [API_LEVEL 4.2 New Features](https://docs.zepp.com/docs/guides/version-info/new-features-42/)
- [Device List & Capabilities](https://docs.zepp.com/docs/reference/related-resources/device-list/)
