import Link from "next/link";
import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import bpcsLogo from "../../public/images/bpcs-logo.png";

const navigation = [
  { name: "Meetings", href: "/", current: false },
  { name: "City Council", href: "/city-council", current: false },
  { name: "Roadmap", href: "/roadmap", current: false },
  { name: "About Us", href: "/about-us", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  return (
    <>
      <Disclosure as="nav" className="bg-primary">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-neutral-off-black hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/">
                      <>
                        <Image src={bpcsLogo} alt="BPCS Logo" width={80} />
                      </>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          href={item.href}
                          key={item.name}
                          className={
                            "rounded-md px-3 py-2 text-base font-medium text-neutral-off-black hover:bg-gray-700 hover:text-white"
                          }
                        >
                          {item.name}
                        </Link>
                        // <Link href={item.href} legacyBehavior>
                        //   <a
                        //     key={item.name}
                        //     className={classNames(
                        //       item.current
                        //         ? "bg-neutral-off-white text-neutral-off-black"
                        //         : "text-neutral-off-black hover:bg-gray-700 hover:text-white",
                        //       "rounded-md px-3 py-2 text-base font-medium"
                        //     )}
                        //     aria-current={item.current ? "page" : undefined}
                        //   >
                        //     {item.name}
                        //   </a>
                        // </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Link href={item.href} key={item.name} legacyBehavior>
                    <>
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-neutral-off-black hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-xl font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    </>
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};
