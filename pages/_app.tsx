import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

import type { AppProps } from "next/app";

import "@styles/globals.css";
import AppContextProvider from "@contexts";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}

export default MyApp;
