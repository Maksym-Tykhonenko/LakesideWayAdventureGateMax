import React from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const LakesideCircleAnimComponent = () => {
    const dimensions = Dimensions.get('window');

    const lakesideHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* From Uiverse.io by Shoh2008 */
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: transparent;
                overflow: hidden;
            }
            .loader {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: inline-block;
                position: relative;
                border: 10px solid;
                box-sizing: border-box;
                animation: animloader 1s linear infinite alternate;
            }
            @keyframes animloader {
                0% {
                    border-color: white rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0);
                }
                33% {
                    border-color: white white rgba(255, 255, 255, 0) rgba(255, 255, 255, 0);
                }
                66% {
                    border-color: white white white rgba(255, 255, 255, 0);
                }
                100% {
                    border-color: white white white white;
                }
            }
        </style>
    </head>
    <body>
        <!-- From Uiverse.io by Shoh2008 --> 
        <div class="loader"></div>
    </body>
    </html>
    `;

    return (
        <View style={{
            width: dimensions.width * 0.8,
            height: dimensions.height * 0.1,
            alignSelf: 'center',
            flex: 1,
        }}>
            <WebView
                source={{ html: lakesideHtmlContent }}
                style={{
                    backgroundColor: 'transparent',
                    flex: 1,
                }}
                mixedContentMode="compatibility"
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                bounces={false}
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                scalesPageToFit={false}
                scrollEnabled={false}
            />
        </View>
    );
};

export default LakesideCircleAnimComponent;