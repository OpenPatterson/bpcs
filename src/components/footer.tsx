import { FunctionComponent } from "react";

export const Footer: FunctionComponent = () => {
  return (
    <footer className="bg-primary text-white py-4">
      <div className="container mx-auto px-4">
        <p className="text-center pb-5 xl:text-xl">We 🍑 Patterson</p>
        <p className="text-center text-sm xl:text-base">We are not affiliated with the City of Patterson and do not own any of the materials provided. As such, we cannot guarantee their accuracy.</p>
      </div>
    </footer>
  );
};

export default Footer;
