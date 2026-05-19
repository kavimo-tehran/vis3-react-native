# Vis3 React Native

Kavimo Vis3 React Native Component.

A drop-in WebView-based wrapper around the Kavimo video player for React Native and Expo applications.

---

## Installation

### React Native (CLI)

```bash
npm install @kavimo-tehran/vis3-react-native react-native-webview
```

With **npm 7+** peer dependencies are installed automatically, so this single command is enough.

If you're on **npm 6 or older**, install peers manually:

```bash
npm install @kavimo-tehran/vis3-react-native
npm install react-native-webview react react-native
```

### Expo

```bash
npx expo install react-native-webview
npm install @kavimo-tehran/vis3-react-native
```

> ⚠️ Don't run `npm install react-native-webview` on an Expo project — it may install an incompatible version. Always use `npx expo install` for native modules.

---

## Basic Usage

```jsx
import { Vis3 } from '@kavimo-tehran/vis3-react-native';

export default function App() {
  return (
    <Vis3 domainName="stream.domain.com" ID="xxxxxxxxxxxx" />
  );
}
```

---

## Usage with onLoad

```jsx
import { Vis3 } from '@kavimo-tehran/vis3-react-native';

export default function App() {

  const handleLoad = (media) => {
    console.log('Vis: Media Loaded');
    console.log(media);
  }

  return (
    <Vis3 domainName="stream.domain.com" ID="xxxxxxxxxxxx" onLoad={handleLoad} />
  );
}
```

---

## Handler Method

```jsx
/**
 * handleLoad - Function to handle the loading of media.
 * @param {Object} media - The media object containing media API and details.
 */
const handleLoad = (media) => {
  console.log('Vis: Media Loaded');
  console.log(media);

  const mediaAPI = media.api;

  // Get Data Methods

  // Get media ID
  mediaAPI.get.ID().then((id) => {
    console.log(`Media ID: ${id}`);
  });

  // Get current playback time
  mediaAPI.get.CurrentTime().then((time) => {
    console.log(`Current Time: ${time}`);
  });

  // Get media duration
  mediaAPI.get.Duration().then((duration) => {
    console.log(`Duration: ${duration}`);
  });

  // Get media title
  mediaAPI.get.Title().then((title) => {
    console.log(`Title: ${title}`);
  });

  // Actions Methods

  // Play the media
  mediaAPI.actions.Play();

  // Pause the media
  mediaAPI.actions.Pause();

  // Seek to a specific time (e.g., 120 seconds)
  mediaAPI.actions.Seek(120);

  // Rewind the media by 5 seconds (default)
  mediaAPI.actions.Rewind();

  // Forward the media by 10 seconds
  mediaAPI.actions.Forward(10);

  // DRM Text
  mediaAPI.DRMText({
    text: ['info@kavimo.com', '00123456789', 'more text'],
    time: '2.5',       // Seconds (optional)
    color: '#FFFFFF',  // Text color (optional)
    fontSize: '13px',  // Font size (% or px) (optional)
    fontStyle: 'bold', // Font style (italic, bold, normal) (optional)
    fontName: 'arial', // Font name (optional)
    opacity: '0.4',    // Text opacity (optional)
  });

  // Events Methods

  mediaAPI.events.OnPlay(() => {
    console.log('Media is playing');
  });

  mediaAPI.events.OnPause(() => {
    console.log('Media is paused');
  });

  mediaAPI.events.OnEnded(() => {
    console.log('Media has ended');
  });

  mediaAPI.events.OnTimeupdate((time) => {
    console.log(`Current time: ${time}`);
  });
};
```

---

## Props

| Prop         | Type       | Required | Description                                     |
| ------------ | ---------- | -------- | ----------------------------------------------- |
| `domainName` | `string`   | yes      | Your Kavimo stream domain (without `https://`). |
| `ID`         | `string`   | yes      | The media ID of the video to play.              |
| `onLoad`     | `function` | no       | Called when the player is ready. Receives a `media` object. |

---

## media.api

### get

> All `get` methods are **async** and return a `Promise`.

| Method          | Returns           | Description                        |
| --------------- | ----------------- | ---------------------------------- |
| `get.ID()`      | `Promise<string>` | Returns the media ID.              |
| `get.CurrentTime()` | `Promise<number>` | Returns current playback time in seconds. |
| `get.Duration()` | `Promise<number>` | Returns total media duration in seconds. |
| `get.Title()`   | `Promise<string>` | Returns the media title.           |

### actions

| Method              | Description                                  |
| ------------------- | -------------------------------------------- |
| `actions.Play()`    | Start playback.                              |
| `actions.Pause()`   | Pause playback.                              |
| `actions.Seek(time)` | Seek to a specific time (seconds).          |
| `actions.Rewind()`  | Rewind by 5 seconds.                         |
| `actions.Forward(sec)` | Forward by N seconds.                   |

### events

| Method                       | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `events.OnPlay(cb)`          | Fires when playback starts.                        |
| `events.OnPause(cb)`         | Fires when playback pauses.                        |
| `events.OnEnded(cb)`         | Fires when playback ends.                          |
| `events.OnTimeupdate(cb)`    | Fires during playback. Callback receives current time. |

### DRMText

```js
mediaAPI.DRMText({
  text: ['line1', 'line2'],  // required
  time: '2.5',               // optional — display duration in seconds
  color: '#FFFFFF',          // optional
  fontSize: '13px',          // optional
  fontStyle: 'bold',         // optional — italic | bold | normal
  fontName: 'arial',         // optional
  opacity: '0.4',            // optional — 0 to 1
});
```

---

## Peer Dependencies

| Package                | Minimum version |
| ---------------------- | --------------- |
| `react`                | `>=17.0.0`      |
| `react-native`         | `>=0.70.0`      |
| `react-native-webview` | `>=11.0.0`      |

We use peer dependencies for `react-native-webview` because it ships native code. Bundling it as a regular dependency would cause duplicate native modules and lead to crashes.

---

## Differences from `@kavimo-tehran/vis3-next-react`

The web package gives direct DOM access to `media.api` synchronously. In React Native the player runs inside a sandboxed WebView, so:

- **`actions`** and **`events`** work identically.
- **`get` methods** are `async` and return a `Promise` (instead of returning a value synchronously) because data must be fetched across the WebView bridge.

---

## License

MIT
