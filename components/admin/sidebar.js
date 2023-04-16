import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  IoAnalyticsOutline,
  IoBagHandleOutline,
  IoBarChartOutline,
  IoBookmarkOutline,
  IoCodeWorkingOutline,
  IoGridOutline,
} from "react-icons/io5";

const navItem = [
  { title: "Dashboard", icon: <IoAnalyticsOutline />, active: true },
  { title: "Products", icon: <IoBagHandleOutline />, active: false },
  { title: "Carousel", icon: <IoCodeWorkingOutline />, active: false },
  { title: "Populer", icon: <IoBarChartOutline />, active: false },
  { title: "Categories", icon: <IoGridOutline />, active: false },
  { title: "Tags", icon: <IoBookmarkOutline />, active: false },
];

const Sidebar = ({ foldSidebar, setLoading }) => {
  const [navLink, setNavLink] = useState(navItem);
  const router = useRouter();
  const active = router.route.split("/")[2];
  useEffect(() => {
    setActive(active ? active : "Dashboard");
  }, []);
  const setActive = (title) => {
    const newNavLink = navLink.map((link) =>
      title.toLowerCase() == link.title.toLowerCase()
        ? { ...link, active: true }
        : { ...link, active: false }
    );
    setNavLink(newNavLink);
  };

  return (
    <section id="sidebar">
      <div
        className={`${
          foldSidebar ? "flex" : "md:flex hidden"
        } top-0 items-start md:w-64 md:pt-24 pt-20 bg-white border-light-gray border-r-2 min-h-screen fixed py-7 z-10 px-3`}>
        <ul className="flex flex-col w-full text-lg items-start gap-3 text-smooth-slate font-sourceSans">
          {navLink.map((item) => (
            <li key={item.title} className={`w-full`}>
              <Link
                replace={true}
                onClick={() => (!item.active ? setLoading(true) : null)}
                className={`${
                  item.active ? "bg-light-gray/50" : ""
                }  cursor-pointer w-full rounded-lg  md:pr-0 pr-10 hover:bg-light-gray/50 flex gap-3 py-2 px-3 items-start`}
                href={`/admin/${
                  item.title == "Dashboard" ? "" : item.title.toLowerCase()
                }`}>
                <span className="text-2xl inline-block pt-[2px]">
                  {item.icon}
                </span>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Sidebar;
