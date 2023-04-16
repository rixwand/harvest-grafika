import Layout from "../components/layout";
import Products from "../components/Semua-produk";
import { useRouter } from "next/router";
import axios from "axios";
export default function Home({ products, categories, tags }) {
  const router = useRouter();
  const { filter } = router.query;
  const data = { products, categories, tags, filter };
  return (
    <Layout title="Produk" navActive="Produk">
      <Products {...data} />
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  const { data: products } = await axios.get(
    "http://localhost:3000/api/products?newest=true&limit=20"
  );
  const { data: categories } = await axios.get(
    "http://localhost:3000/api/categories"
  );
  const { data: tags } = await axios.get("http://localhost:3000/api/tags");
  return { props: { products, categories, tags } };
};
