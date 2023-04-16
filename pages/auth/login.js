import Head from "next/head";
import React, { useState } from "react";
import { IoKey, IoMail } from "react-icons/io5";
import router from "next/router";
import Loading from "../../components/loading";
import Cookies from "js-cookie";
import { withoutAuth } from "../../components/HOC/Auth";

export const getServerSideProps = withoutAuth((ctx) => {
  return { props: {} };
});

const login = () => {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: Boolean, message: "" });

  const fieldHandler = (e) => {
    const name = e.target.getAttribute("name");
    setFields({
      ...fields,
      [name]: e.target.value,
    });
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const check = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!check.ok) {
      setLoading(false);
      return setStatus({
        success: false,
        message: "wrong email and password",
      });
    }
    const result = await check.json();
    Cookies.set("token", result.token);
    router.push("/admin");
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <section id="login" className="bg-[#f2f6ff] min-h-screen ">
        <div className="md:container flex flex-col items-center ">
          <h1 className="text-2xl font-bold font-sourceSans text-center bg-clip-text text-[#0536ff] mt-36">
            Harvest Grafika
          </h1>
          <div className="flex flex-col justify-center items-center md:py-7 md:px-8 md:w-fit p-7 mx-7  bg-white mt-9 rounded-lg drop-shadow-sm">
            <h2 className="text-[#324567] font-inter font-semibold text-xl">
              Welcome Back
            </h2>
            <p className="text-sm mt-2 text-[#a1b3d2] font-light font-sourceSans">
              Enter your credentials to access admin panel
            </p>
            <p
              className={`text-sm text-start mt-3 -mb-6  ${
                !status.message ? "hidden" : "text-rose-600"
              } font-sourceSans`}>
              {status.message}
            </p>
            <form onSubmit={formHandler}>
              <div className="mt-7 md:w-80 w-full flex flex-wrap items-center">
                <span className="group flex border-[#e6eeff] w-full border-2 rounded-md overflow-hidden">
                  <span className="px-4 py-3 inline-block">
                    <IoMail fill="#0536ff" />
                  </span>
                  <input
                    onChange={fieldHandler}
                    autoComplete="off"
                    type="email"
                    name="email"
                    id="email"
                    className="focus-within:outline-none text-[#324567] placeholder:text-[#5a719d] text-sm placeholder:font-light py-2 pr-2 font-sourceSans w-full"
                    placeholder="Enter your email"
                  />
                </span>
                <span className="mt-5 group flex border-[#e6eeff] w-full border-2 rounded-md overflow-hidden">
                  <span className="px-4 py-3 inline-block">
                    <IoKey fill="#0536ff" />
                  </span>
                  <input
                    onChange={fieldHandler}
                    type="password"
                    name="password"
                    id="password"
                    className="focus-within:outline-none text-[#324567] placeholder:text-[#5a719d] text-sm placeholder:font-light py-2 pr-2 font-sourceSans w-full"
                    placeholder="Enter your password"
                  />
                </span>
                <button
                  type="submit"
                  className="bg-[#2662ff] py-3 w-full mt-5 rounded-md  font-sourceSans text-white mb-3">
                  Sign In
                </button>
              </div>
            </form>
          </div>
          <p className="mt-8 text-[#7889a4] text-sm tracking-wide font-sourceSans">
            Forgot your password?{" "}
            <button className="text-[#0536ff]">Reset Password</button>
          </p>
        </div>
        {loading ? <Loading /> : null}
      </section>
    </>
  );
};

export default login;
