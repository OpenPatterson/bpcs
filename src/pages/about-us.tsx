import { type NextPage } from "next";
import Image from "next/image";
import HeroImage from "../../public/images/hero.png";
import Link from "next/link";

const AboutUs: NextPage = () => {
  return (
    <>
      <div className="content mx-auto flex w-2/3 flex-wrap items-start pt-10 2xl:w-1/2">
        <div className="space-y-5 text-lg md:text-2xl 2xl:text-4xl">
          <Image
            src={HeroImage}
            alt={
              "Illustration of man and woman connecting puzzle pieces with websites behind them."
            }
            className="float-right"
          />
          <div className="">
            We built this website so that Patterson residents can more easily
            find the agendas and schedules of the Patterson City Council
            meetings. BPCS stands for the Better Patterson Council Site project.
            We hope to keep expanding on this site to make it more useful for
            the community. That may mean adding the ability to get notified
            through text or email when a new meeting is scheduled, or adding a
            way to submit public comments to the city council. Current plans can
            be found in the Roadmap at the top of this page. If you have any
            ideas feel free to email us at{" "}
            <Link
              href={"mailto:carlos@openpatterson.org"}
              className="font-medium underline"
            >
              carlos@openpatterson.org
            </Link>
          </div>
          <div className="">
            Looking to make a difference in your local community? Look no
            further than Open Patterson! We&apos;re a civic-tech organization
            made up entirely of volunteers, and we&apos;re focused on using
            technology to improve the world around us.
          </div>
          <div className="">
            Whether you&apos;re an experienced software engineer or a passionate
            designer, there&apos;s a place for you in our community. We work on
            independent projects and collaborate with local nonprofits to serve
            the greater Stanislaus area, including Patterson.
          </div>
          <div className="">
            Open Patterson officially started in 2022, but our real projects
            began in 2023. We&apos;re always looking for new volunteers to join
            us and help us make an even bigger difference.
          </div>
          <div className="">
            So if you&apos;re interested in volunteering with us or have an idea
            for a project, don&apos;t hesitate to reach out. We&apos;d love to
            hear from you and work together to create positive change in our
            community.
          </div>
        </div>
      </div>
      <div className="">
        <Link href={"https://openpatterson.org/"} className="my-10 flex">
          <button className="mx-auto w-1/3 rounded-md bg-primary py-5 text-lg font-bold text-white hover:text-black md:text-2xl 2xl:text-4xl">
            Click to go to Open Patterson
          </button>
        </Link>
      </div>
    </>
  );
};

export default AboutUs;
