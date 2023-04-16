import Cookies from "js-cookie";
import Router from "next/router";
import React, { useRef } from "react";
import {
  IoEllipsisVertical,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";

const Navbar = ({ foldSidebar, setFoldSidebar }) => {
  const checkbox = useRef();
  const showSidebar = (e) => {
    checkbox.current.click();
    setFoldSidebar(checkbox.current.checked);
  };
  const logout = () => {
    Cookies.remove("token");
    Router.push("/");
  };
  return (
    <nav className="flex top-0 fixed w-full bg-white justify-between py-5 md:px-8 pr-8 pl-4 border-b-2 z-20 border-light-gray">
      <span className="flex gap-2 ">
        <div className="flex md:hidden justify-center items-center ">
          <button onClick={showSidebar} className="text-xl">
            <IoEllipsisVertical fill="#a1b3d2" />
          </button>
          <input
            type={"checkbox"}
            id="navcheckbox"
            ref={checkbox}
            className="hidden peer/navcheckbox"
          />
        </div>
        <h1 className="text-2xl font-sourceSans font-bold text-primary bg">
          Harvest Grafika
        </h1>
      </span>
      <span className="flex">
        <button
          onClick={logout}
          className="flex text-2xl items-center justify-center hover:scale-125 transition-all duration-300">
          <IoLogOutOutline className="stroke-[#a1b3d2] hover:stroke-smooth-slate" />
        </button>
        <button className="flex text-2xl ml-3 items-center justify-center">
          <IoSettingsOutline className="stroke-[#a1b3d2] hover:stroke-smooth-slate hover:rotate-180 transition-all duration-300" />
        </button>

        <div className="profile ml-4 w-8 h-8 rounded-full bg-light-gray"></div>
      </span>
    </nav>
  );
};

export default Navbar;
