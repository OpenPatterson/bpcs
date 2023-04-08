import { type AppType } from "next/dist/shared/lib/utils";
import Script from "next/script";
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Script
        data-host="https://microanalytics.io"
        data-dnt="false"
        src="https://microanalytics.io/js/script.js"
        id="ZwSg9rf6GA"
        async
        defer
      />
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow">
          <Navbar />
          <Component {...pageProps} />
        </div>
        <div className="flex-shrink-0">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default MyApp;
