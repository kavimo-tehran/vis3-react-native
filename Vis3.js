import React, { useRef, useState } from "react";
import { Modal, StatusBar, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const Vis3 = ({ domainName, ID, onLoad, onPlay, onPause, onEnded }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layout, setLayout] = useState(null);
  const containerRef = useRef(null);
  const webviewRef = useRef(null);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; }
        body, html { background: #000; width: 100%; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: 0; }
      </style>
    </head>
    <body>
      <iframe
        src="https://${domainName}/${ID}/iframe"
        allow="autoplay; fullscreen"
        allowfullscreen
      ></iframe>
      <script>
        window.addEventListener('message', function(e) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              origin: e.origin,
              data: e.data
            }));
          }
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      const action = msg.data?.action;
      const evt = msg.data?.event;

      if (action === "VisIframeEnter") setIsFullscreen(true);
      if (action === "VisIframeExit") setIsFullscreen(false);

      if (evt === "loaded" && onLoad) onLoad(msg.data);
      if (evt === "play" && onPlay) onPlay(msg.data);
      if (evt === "pause" && onPause) onPause(msg.data);
      if (evt === "ended" && onEnded) onEnded(msg.data);
    } catch (e) {}
  };

  const measure = () => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) {
          setLayout({ x, y, width, height });
        }
      });
    }
  };

  return (
    <>
      <View ref={containerRef} onLayout={measure} style={styles.container} />

      {layout && (
        <Modal
          visible={true}
          transparent={true}
          animationType="none"
          supportedOrientations={["portrait", "landscape"]}
          statusBarTranslucent
        >
          {isFullscreen && <StatusBar hidden />}
          <View
            pointerEvents="box-none"
            style={
              isFullscreen
                ? styles.fullscreen
                : {
                    position: "absolute",
                    top: layout.y,
                    left: layout.x,
                    width: layout.width,
                    height: layout.height,
                    borderRadius: 8,
                    overflow: "hidden",
                  }
            }
          >
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
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export { Vis3 };
export default Vis3;
