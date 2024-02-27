import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { Auth } from "./features/auth/auth";
import "./index.css";

import locale from "antd/es/locale/ru_RU";
import updateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.extend(updateLocale);
dayjs.updateLocale("ru", {
  weekStart: 1
});

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <Auth>
                    <ConfigProvider theme={{
                            algorithm: theme.defaultAlgorithm
                        }}
                        locale={locale}
                    >
                        <App />
                    </ConfigProvider>
                </Auth>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
