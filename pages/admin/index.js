import Layout from "../../components/admin/layout";
import { withAuth } from "../../components/HOC/Auth";

export const getServerSideProps = withAuth((ctx) => {
  return { props: {} };
});

const Admin = () => {
  return (
    <Layout title="Dashboard">
      <h1 className="text-2xl font-semibold text-solid-slate font-sourceSans">
        Dashboard
      </h1>
    </Layout>
  );
};

export default Admin;
