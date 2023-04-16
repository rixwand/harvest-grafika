import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";
import Loading from "./loading";

const Layout = (props) => {
  const { setLoading, loading } = props;
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Navbar active={props.navActive} {...props} />
      {props.children}
      {loading && <Loading />}
      <Footer />
    </>
  );
};

export default Layout;
