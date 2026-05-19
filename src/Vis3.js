import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import createMedia from "./createMedia";

const Vis3 = ({ domainName, ID, onLoad }) => {
  const webviewRef = useRef(null);
  const eventHandlers = useRef({});
  const pendingRequests = useRef({});

  const handleMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);

      if (msg.event === "loaded" && onLoad)
        onLoad(createMedia(webviewRef, eventHandlers, pendingRequests));
      if (msg.event === "play") eventHandlers.current.play?.();
      if (msg.event === "pause") eventHandlers.current.pause?.();
      if (msg.event === "ended") eventHandlers.current.ended?.();
      if (msg.event === "timeupdate") eventHandlers.current.timeupdate?.(msg.data);
      if (msg.event === "get" && pendingRequests.current[msg.id]) {
        pendingRequests.current[msg.id](msg.value);
        delete pendingRequests.current[msg.id];
      }
    } catch (e) {}
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; }
        body, html { background: #000; width: 100%; height: 100%; overflow: hidden; }
        #vis3-player { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="vis3-player"></div>
      <script>
        function send(event, data) {
          var msg = { event: event };
          if (data !== undefined) msg.data = data;
          window.ReactNativeWebView.postMessage(JSON.stringify(msg));
        }

        window.vis3_callback = function(media) {
          window.__vis3api = media.api;
          send('loaded');
          media.api.events.OnPlay(function() { send('play'); });
          media.api.events.OnPause(function() { send('pause'); });
          media.api.events.OnEnded(function() { send('ended'); });
          media.api.events.OnTimeupdate(function(time) { send('timeupdate', time); });
        };

        var s = document.createElement('script');
        s.src = 'https://${domainName}/${ID}/embed?container=vis3-player&callback=vis3_callback';
        document.body.appendChild(s);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ html, baseUrl: `https://${domainName}` }}
        onMessage={handleMessage}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        allowsFullscreenVideo
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export { Vis3 };
export default Vis3;
