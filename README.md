# Vis3 for React Native

Put the Kavimo Vis3 video player in a React Native or Expo app with a single component.

- React Native (CLI) and Expo
- Runs the player in a `WebView` (`react-native-webview`)
- Cleans up after itself: when the component unmounts, the player is removed


## Installation

### React Native (CLI)

```bash
npm install @kavimo-tehran/vis3-react-native react-native-webview
cd ios && pod install
```

### Expo

```bash
npx expo install react-native-webview
npm install @kavimo-tehran/vis3-react-native
```

> In an Expo project, install `react-native-webview` with `npx expo install`, not `npm install`, so you get the version that matches your Expo SDK.


## Quick start

```jsx
import { Vis3 } from '@kavimo-tehran/vis3-react-native'

export default function App() {
  return <Vis3 domainName="stream.domain.com" ID="xxxxxxxxxxxx" />
}
```

- `domainName` is your Kavimo stream domain, without `https://`
- `ID` is the ID of the video

The player fills the width of its parent with a 16:9 shape. To make it narrower, wrap it in a `View` with the width you want.


## Examples

### Inside a screen

```jsx
import { SafeAreaView, Text } from 'react-native'
import { Vis3 } from '@kavimo-tehran/vis3-react-native'

export default function LessonScreen() {
  return (
    <SafeAreaView>
      <Text>Lesson 1</Text>
      <Vis3 domainName="stream.domain.com" ID="xxxxxxxxxxxx" />
    </SafeAreaView>
  )
}
```

### Control the player with your own buttons

Keep `media.api` from `onLoad`, then call it whenever you need:

```jsx
import { useRef } from 'react'
import { View, Button } from 'react-native'
import { Vis3 } from '@kavimo-tehran/vis3-react-native'

export default function Player() {
  const player = useRef(null)

  return (
    <View>
      <Vis3
        domainName="stream.domain.com"
        ID="xxxxxxxxxxxx"
        onLoad={(media) => { player.current = media.api }}
      />

      <Button title="Play" onPress={() => player.current?.actions.Play()} />
      <Button title="Pause" onPress={() => player.current?.actions.Pause()} />
      <Button title="Jump to 1:00" onPress={() => player.current?.actions.Seek(60)} />
    </View>
  )
}
```

### Read information

The player runs inside a WebView, so every `get` method returns a **Promise**. Use `await` (or `.then`):

```jsx
const handleLoad = async (media) => {
  const title = await media.api.get.Title()
  const duration = await media.api.get.Duration()
  console.log(`${title} is ${duration} seconds long`)
}
```

### Listen to playback events

```jsx
const handleLoad = (media) => {
  const api = media.api

  api.events.OnPlay(() => console.log('Playing'))
  api.events.OnPause(() => console.log('Paused'))
  api.events.OnEnded(() => console.log('Finished'))

  api.events.OnTimeupdate(async () => {
    console.log('Now at second', await api.get.CurrentTime())
  })
}

<Vis3 domainName="stream.domain.com" ID="xxxxxxxxxxxx" onLoad={handleLoad} />
```

Each event keeps one function: calling `OnPlay` again replaces the previous one.

### Save the viewer's progress

```jsx
const handleLoad = (media) => {
  const api = media.api

  api.events.OnEnded(async () => {
    await fetch('https://your-api.com/progress', {
      method: 'POST',
      body: JSON.stringify({ video: await api.get.ID(), done: true }),
    })
  })
}
```

### Show another video

Just change `ID`. The player reloads with the new video:

```jsx
import { useState } from 'react'
import { View, Button } from 'react-native'
import { Vis3 } from '@kavimo-tehran/vis3-react-native'

export default function Course() {
  const [videoID, setVideoID] = useState('xxxxxxxxxxxx')

  return (
    <View>
      <Vis3 domainName="stream.domain.com" ID={videoID} />
      <Button title="Next lesson" onPress={() => setVideoID('yyyyyyyyyyyy')} />
    </View>
  )
}
```

### Watermark (DRM text)

Show the viewer's details over the video, so a screen recording can be traced back:

```jsx
const handleLoad = (media) => {
  media.api.DRMText({
    text: ['user@example.com', '09123456789'],
    time: '2.5',        // seconds between moves (optional)
    color: '#FFFFFF',   // (optional)
    fontSize: '13px',   // px or % (optional)
    fontStyle: 'bold',  // normal, bold or italic (optional)
    fontName: 'arial',  // (optional)
    opacity: '0.4',     // (optional)
  })
}
```

### TypeScript

Types are included:

```tsx
import { Vis3, Vis3Media } from '@kavimo-tehran/vis3-react-native'

const handleLoad = (media: Vis3Media) => {
  media.api.actions.Play()
}
```


## Props

| Prop         | Type     | Required | Description                                              |
| ------------ | -------- | -------- | -------------------------------------------------------- |
| `domainName` | string   | Yes      | Your stream domain, e.g. `stream.domain.com`             |
| `ID`         | string   | Yes      | The video ID. Change it to show another video            |
| `onLoad`     | function | No       | Called once the player is ready, with the `media` object |


## The `media` object

`onLoad` receives `media`. Everything you can do with the player is on `media.api`.

### `api.get`: read information (returns a Promise)

| Method              | Resolves to                  |
| ------------------- | ---------------------------- |
| `get.ID()`          | The video ID                 |
| `get.Title()`       | The video title              |
| `get.Duration()`    | Length, in seconds           |
| `get.CurrentTime()` | Current position, in seconds |

### `api.actions`: control playback

| Method                     | Does                                           |
| -------------------------- | ---------------------------------------------- |
| `actions.Play()`           | Plays                                          |
| `actions.Pause()`          | Pauses                                         |
| `actions.Seek(seconds)`    | Jumps to a position                            |
| `actions.Forward(seconds)` | Goes forward by the given seconds              |
| `actions.Rewind()`         | Goes back 5 seconds                            |
| `actions.Destroy()`        | Removes the player and stops all its downloads |

You don't need `Destroy()` with `<Vis3 />`: unmounting the component already does it. It is for a player you keep on screen but no longer want running.

### `api.events`: listen to playback

| Method                    | Your function runs when…                       |
| ------------------------- | ---------------------------------------------- |
| `events.OnPlay(fn)`       | Playback starts or resumes                     |
| `events.OnPause(fn)`      | Playback pauses                                |
| `events.OnEnded(fn)`      | The video reaches the end                      |
| `events.OnTimeupdate(fn)` | The position changes; read `get.CurrentTime()` |

### `api.DRMText(options)`: watermark

| Option      | Example                | Description                      |
| ----------- | ---------------------- | -------------------------------- |
| `text`      | `['user@example.com']` | Lines of text to show (required) |
| `time`      | `'2.5'`                | Seconds between moves            |
| `color`     | `'#FFFFFF'`            | Text color                       |
| `fontSize`  | `'13px'`               | Size in px or %                  |
| `fontStyle` | `'bold'`               | `normal`, `bold` or `italic`     |
| `fontName`  | `'arial'`              | Font family                      |
| `opacity`   | `'0.4'`                | From `0` to `1`                  |


## Troubleshooting

| Problem                                  | Fix                                                              |
| ---------------------------------------- | ---------------------------------------------------------------- |
| Nothing shows up                         | Check `domainName` (no `https://`, no trailing `/`) and `ID`     |
| Error about `react-native-webview`       | Install it (see *Installation*); on iOS run `pod install`        |
| `get.Title()` prints `[object Promise]`  | `get` methods return Promises: use `await`                       |
| `Forward()` does nothing                 | Pass the seconds: `Forward(10)`                                  |


## License

MIT
