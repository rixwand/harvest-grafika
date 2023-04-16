import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { IoKey, IoMail, IoPerson } from "react-icons/io5";
import { withoutAuth } from "../../components/HOC/Auth";
import Loading from "../../components/loading";

export const getServerSideProps = withoutAuth((ctx) => {
  return { props: {} };
});

const login = () => {
  const [fields, setFields] = useState({
    username: "",
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
    const addAdmin = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    if (!addAdmin.ok) {
      const err = await addAdmin.json();
      if (err.code == "ER_DUP_ENTRY") {
        setLoading(false);
        return setStatus({
          success: false,
          message: "email already registered",
        });
      }
    }
    setStatus({
      success: true,
      message: "registration success",
    });
    setFields({
      username: "",
      email: "",
      password: "",
    });
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <section id="login" className="bg-[#f2f6ff] min-h-screen ">
        <div className="md:container flex flex-col items-center ">
          <h1 className="text-2xl font-bold font-sourceSans text-center bg-clip-text text-[#0536ff] mt-36">
            Harvest Grafika
          </h1>
          <div className="flex flex-col justify-center items-center md:py-7 md:px-8 md:w-fit p-7 mx-7  bg-white mt-9 rounded-lg drop-shadow-sm">
            <h2 className="text-[#324567] font-inter font-semibold text-xl">
              Sign Up
            </h2>
            <p className="text-sm mt-2 text-[#a1b3d2] font-light font-sourceSans">
              Create admin account
            </p>
            <p
              className={`text-sm text-start mt-3 -mb-6  ${
                !status.message
                  ? "hidden"
                  : !status.success
                  ? "text-rose-600"
                  : "text-emerald-600"
              } font-sourceSans`}>
              {status.message}
            </p>

            <form onSubmit={formHandler}>
              <div className="mt-7 md:w-80 w-full flex flex-wrap items-center">
                <span className="group flex border-[#e6eeff] w-full border-2 rounded-md overflow-hidden">
                  <span className="px-4 py-3 inline-block">
                    <IoPerson fill="#0536ff" />
                  </span>
                  <input
                    onChange={fieldHandler}
                    value={fields.username}
                    type="text"
                    name="username"
                    id="username"
                    className="focus-within:outline-none text-[#324567] placeholder:text-[#5a719d] text-sm placeholder:font-light py-2 pr-2 font-sourceSans w-full"
                    placeholder="Enter your username"
                    required
                  />
                </span>
                <span className="group flex mt-3 border-[#e6eeff] w-full border-2 rounded-md overflow-hidden">
                  <span className="px-4 py-3 inline-block">
                    <IoMail fill="#0536ff" />
                  </span>
                  <input
                    onChange={fieldHandler}
                    value={fields.email}
                    type="email"
                    name="email"
                    id="email"
                    className="focus-within:outline-none text-[#324567] placeholder:text-[#5a719d] text-sm placeholder:font-light py-2 pr-2 font-sourceSans w-full"
                    placeholder="Enter your email"
                    required
                  />
                </span>
                <span className="mt-3 group flex border-[#e6eeff] w-full border-2 rounded-md overflow-hidden">
                  <span className="px-4 py-3 inline-block">
                    <IoKey fill="#0536ff" />
                  </span>
                  <input
                    onChange={fieldHandler}
                    value={fields.password}
                    type="password"
                    name="password"
                    id="password"
                    className="focus-within:outline-none text-[#324567] placeholder:text-[#5a719d] text-sm placeholder:font-light py-2 pr-2 font-sourceSans w-full"
                    placeholder="Enter your password"
                    required
                  />
                </span>
                <button className="bg-[#2662ff] py-3 w-full mt-3 rounded-md  font-sourceSans text-white mb-3">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
          <p className="mt-8 text-[#7889a4] text-sm tracking-wide font-sourceSans">
            Already have an account?{" "}
            <Link href={"/auth/login"} className="text-[#0536ff]">
              Login
            </Link>
          </p>
        </div>
      </section>
      {loading ? <Loading /> : null}
    </>
  );
};

export default login;
