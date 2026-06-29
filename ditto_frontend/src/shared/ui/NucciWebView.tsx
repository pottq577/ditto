import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface NucciWebViewProps {
  base64Image: string | null;
  onSuccess: (base64: string) => void;
  onError: (error: string) => void;
}

export const NucciWebView = ({
  base64Image,
  onSuccess,
  onError,
}: NucciWebViewProps) => {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="module">
          import { removeBackground } from "https://esm.sh/@imgly/background-removal@1.4.3";
          import * as ort from "https://esm.sh/onnxruntime-web@1.17.0";

          // imgly 내부에서 wasm 경로를 잘못 덮어씌우는 버그를 방지 (프리징)
          Object.defineProperty(ort.env.wasm, 'wasmPaths', {
            get: () => "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.0/dist/",
            set: () => {}
          });

          // 오류 로깅을 위한 콘솔 오버라이드
          const logToRN = (msg) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', data: msg }));
          };
          window.console.log = logToRN;
          window.console.error = logToRN;

          document.addEventListener('message', async function(e) {
            logToRN("Received message from RN");
            processImage(e.data);
          });
          window.addEventListener('message', async function(e) {
            logToRN("Received message from RN (window)");
            processImage(e.data);
          });

          async function processImage(base64) {
            try {
              if (!base64) return;
              logToRN("Started processImage");
              
              const response = await fetch('data:image/jpeg;base64,' + base64);
              const blob = await response.blob();
              logToRN("Converted to blob");
              
              const config = {
                publicPath: "https://unpkg.com/@imgly/background-removal-data@1.4.3/dist/",
                debug: true
              };
              logToRN("Calling imglyRemoveBackground...");
              
              const resultBlob = await removeBackground(blob, config);
              logToRN("imglyRemoveBackground success");
              
              const reader = new FileReader();
              reader.onloadend = () => {
                logToRN("FileReader onloadend");
                const resultBase64 = reader.result.split(',')[1];
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'success', data: resultBase64 }));
              };
              reader.readAsDataURL(resultBlob);
            } catch (err) {
              logToRN("Error occurred: " + err.message);
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', data: err.message }));
            }
          }

          logToRN("WebView loaded, sending ready");
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
        </script>
      </head>
      <body></body>
    </html>
  `;

  useEffect(() => {
    if (isReady && base64Image && webViewRef.current) {
      webViewRef.current.postMessage(base64Image);
    }
  }, [base64Image, isReady]);

  return (
    <View style={styles.hidden}>
      <WebView
        ref={webViewRef}
        source={{ html, baseUrl: 'https://localhost' }}
        originWhitelist={["*"]}
        onMessage={(event) => {
          try {
            const result = JSON.parse(event.nativeEvent.data);
            if (result.type === "ready") {
              setIsReady(true);
            } else if (result.type === "log") {
              console.log("[WebView Log]", result.data);
            } else if (result.type === "success") {
              onSuccess(result.data);
            } else if (result.type === "error") {
              onError(result.data);
            }
          } catch (e) {
            console.log("[WebView Unknown Msg]", event.nativeEvent.data);
          }
        }}
        javaScriptEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    height: 1,
    width: 1,
    opacity: 0,
    position: "absolute",
    top: -1000,
  },
});
