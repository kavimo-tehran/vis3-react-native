# Vis3 React Native

Kavimo Vis3 React Native Component.

A drop-in WebView-based wrapper around the Kavimo video player for React Native and Expo applications.

---

## Installation

### React Native (CLI)

```bash
npm install @kavimo-tehran/vis3-react-native react-native-webview
```

With **npm 7+** (default since 2021), peer dependencies are installed automatically, so this single command is enough.

If you're on **npm 6 or older**, install peers manually:

```bash
npm install @kavimo-tehran/vis3-react-native
npm install react-native-webview react react-native
```

### Expo

For Expo projects, install `react-native-webview` with the Expo CLI so the version matches your SDK:

```bash
npx expo install react-native-webview
npm install @kavimo-tehran/vis3-react-native
```

> ⚠️ Don't run `npm install react-native-webview` on an Expo project — it may install an incompatible version. Always use `npx expo install` for native modules.

---

## Usage

```jsx
import { Vis3 } from "@kavimo-tehran/vis3-react-native";

export default function App() {
  return (
    <Vis3
      domainName="stream.domain.com"
      ID="xxxxxxxxxxxx"
    />
  );
}
```

---

## Props

| Prop         | Type     | Required | Description                                     |
| ------------ | -------- | -------- | ----------------------------------------------- |
| `domainName` | `string` | yes      | Your Kavimo stream domain (without `https://`). |
| `ID`         | `string` | yes      | The media ID of the video to play.              |

---

## Peer Dependencies

| Package                | Minimum version |
| ---------------------- | --------------- |
| `react`                | `>=17.0.0`      |
| `react-native`         | `>=0.70.0`      |
| `react-native-webview` | `>=11.0.0`      |

We use peer dependencies (instead of regular `dependencies`) for `react-native-webview` because it ships native code. Bundling it as a regular dependency would cause **duplicate native modules** in your app and lead to crashes.

---

## License

MIT
