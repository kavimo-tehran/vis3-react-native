# Vis3 React Native

Kavimo Vis3 React Native Component.

A drop-in WebView-based wrapper around the Kavimo video player for React Native and Expo applications. Supports fullscreen, playback events, and works with the player's built-in fullscreen button.

---

## Installation

```bash
npm install vis3-react-native react-native-webview
```

Or with yarn:

```bash
yarn add vis3-react-native react-native-webview
```

### Expo

If you're using Expo, install the WebView dependency with the Expo CLI so the correct version is selected for your SDK:

```bash
npx expo install react-native-webview
npm install vis3-react-native
```

---

## Use in React Native:

```jsx
import { Vis3 } from "vis3-react-native";

export default function App() {
  const handleLoad = (media) => {
    console.log("Vis: Media Loaded");
    console.log(media);
  };

  return (
    <Vis3
      domainName="stream.domain.com"
      ID="xxxxxxxxxxxx"
      onLoad={handleLoad}
    />
  );
}
```

---

## Use in Expo:

Identical to React Native. Just make sure `react-native-webview` is installed via `npx expo install`.

```jsx
import { View } from "react-native";
import { Vis3 } from "vis3-react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Vis3
        domainName="stream.domain.com"
        ID="xxxxxxxxxxxx"
        onPlay={() => console.log("playing")}
        onPause={() => console.log("paused")}
        onEnded={() => console.log("ended")}
      />
    </View>
  );
}
```

---

## Props

| Prop          | Type       | Required | Description                                        |
| ------------- | ---------- | -------- | -------------------------------------------------- |
| `domainName`  | `string`   | yes      | Your Kavimo stream domain (without `https://`).    |
| `ID`          | `string`   | yes      | The media ID of the video to play.                 |
| `onLoad`      | `function` | no       | Called when the player reports the media is ready. |
| `onPlay`      | `function` | no       | Called when playback starts.                       |
| `onPause`     | `function` | no       | Called when playback pauses.                       |
| `onEnded`     | `function` | no       | Called when playback finishes.                     |

---

## Fullscreen behavior

The Kavimo player has a built-in fullscreen button. When the user taps it, the component listens for the player's `VisIframeEnter` / `VisIframeExit` postMessage events and expands the WebView to fill the screen using a transparent native `Modal`. The same WebView instance is reused, so playback is **not** interrupted when entering or exiting fullscreen.

### Optional: lock to landscape on fullscreen

If you want the screen to rotate to landscape when entering fullscreen (similar to YouTube), install `expo-screen-orientation`:

```bash
npx expo install expo-screen-orientation
```

Wrap the component or call `lockAsync` from your own code based on the `onPlay` / fullscreen state. The component itself does not depend on `expo-screen-orientation` to keep the package minimal.

---

## Safe area on Android / iOS

When entering fullscreen, the Modal sits above the system UI. If the player controls overlap with the notch or navigation bar on your device, wrap your app with `SafeAreaProvider` and adjust accordingly:

```bash
npx expo install react-native-safe-area-context
```

```jsx
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      {/* your app */}
    </SafeAreaProvider>
  );
}
```

---

## How it works

The Kavimo player is a web player and ships only as a JavaScript embed. To use it on native, this component renders an HTML page inside a `react-native-webview` that contains the official Kavimo `<iframe>`. PostMessage events emitted by the player (such as fullscreen requests) are forwarded from the WebView to React Native via `window.ReactNativeWebView.postMessage`, where the component reacts to them by resizing the WebView container.

The WebView itself is rendered inside a long-lived transparent `Modal` that is positioned over the placeholder `<View>`. This means the WebView instance is created once and never unmounted on fullscreen toggle, preserving playback state.

---

## Differences from `@kavimo-tehran/vis3-next-react`

The web package exposes a rich `mediaAPI` (`mediaAPI.actions.Play()`, `mediaAPI.get.Duration()`, `mediaAPI.DRMText(...)`, etc.) via direct DOM access. This is not available in React Native because the player lives inside a sandboxed WebView. If you need programmatic control, send a message into the WebView using a ref and `injectJavaScript`. PRs welcome.

---

## License

MIT
