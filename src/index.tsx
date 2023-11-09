import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import "./index.css";
import { Auth } from "./features/auth/auth";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <Auth>
                    <ConfigProvider theme={{
                        algorithm: theme.defaultAlgorithm
                    }}>
                        <App />
                    </ConfigProvider>
                </Auth>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
