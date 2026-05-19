import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const Vis3 = ({ domainName, ID }) => {
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
        var s = document.createElement('script');
        s.src = 'https://${domainName}/${ID}/embed?container=vis3-player';
        document.body.appendChild(s);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html, baseUrl: `https://${domainName}` }}
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
