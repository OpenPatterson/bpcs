import { type AppType } from "next/dist/shared/lib/utils";
import Script from "next/script";
import { Navbar } from "~/components/navbar";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
  <>
  <Script data-host="https://microanalytics.io" data-dnt="false" src="https://microanalytics.io/js/script.js" id="ZwSg9rf6GA" async defer />
    <Navbar />
    <Component {...pageProps} />
  </>
  );
};

export default MyApp;
