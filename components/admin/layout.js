import Head from "next/head";
import { useState } from "react";
import Loading from "../loading";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = (props) => {
  const [foldSidebar, setFoldSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const properties = { foldSidebar, setFoldSidebar, loading, setLoading };
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Navbar {...properties} />
      <Sidebar {...properties} />
      <section className="pt-[87px] md:px-0 px-6 md:pl-[275px] overflow-x-scroll min-h-screen scrollbar-hide">
        {loading ? <Loading /> : null}
        {props.children}
      </section>
    </>
  );
};

export default Layout;
