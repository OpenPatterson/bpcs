import { type NextPage } from "next";
import Image from "next/image";
import HeroImage from "../../public/images/hero.png";
import Link from "next/link";

const AboutUs: NextPage = () => {
  return (
    <>
      <div className="content mx-auto flex w-2/3 flex-wrap items-start pt-10">
        <div className="item-body w-1/3 space-y-5">
          <div className="">
            Looking to make a difference in your local community? Look no
            further than Open Patterson! We&apos;re a civic-tech organization made up
            entirely of volunteers, and we&apos;re focused on using technology to
            improve the world around us.
          </div>
          <div className="">
            Whether you&apos;re an experienced software engineer or a passionate
            designer, there&apos;s a place for you in our community. We work on
            independent projects and collaborate with local nonprofits to serve
            the greater Stanislaus area, including Patterson.
          </div>
          <div className="">
            Open Patterson officially started in 2022, but our real projects
            began in 2023. We&apos;re always looking for new volunteers to join us
            and help us make an even bigger difference.
          </div>
          <div className="">
            So if you&apos;re interested in volunteering with us or have an idea for
            a project, don&apos;t hesitate to reach out. We&apos;d love to hear from you
            and work together to create positive change in our community.
          </div>
        </div>
        <div className="float-right w-2/3">
          <Image
            src={HeroImage}
            alt={
              "Illustration of man and woman connecting puzzle pieces with websites behind them."
            }
          />
        </div>
      </div>
      <div className="">
        <Link href={"https://openpatterson.org/"} className="mt-10 flex">
          <button className="mx-auto w-1/3 rounded-md bg-primary font-bold text-white">
            Click to go to Open Patterson
          </button>
        </Link>
      </div>
    </>
  );
};

export default AboutUs;
