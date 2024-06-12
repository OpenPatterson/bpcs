import { type AppType } from "next/dist/shared/lib/utils";
import Script from "next/script";
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
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
