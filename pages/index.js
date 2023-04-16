import Hero from "../components/Hero";
import ProdukPopuler from "../components/Products/Produk-Populer";
import ProdukBaru from "../components/Products/Produk-baru";
import CategoryProduk from "../components/Products/Category-produk";
import Produk from "../components/Products/Produk";
import Layout from "../components/layout";
import axios from "axios";
import { useState } from "react";
import Contact from "../components/contact";

export default function Home({ products, categories, carousel, populer }) {
  const [loading, setLoading] = useState(false);
  const load = { loading, setLoading };

  return (
    <Layout title="Harvest Grafika" {...load}>
      <Hero />
      <ProdukPopuler data={populer} />
      <ProdukBaru data={carousel} />
      <CategoryProduk data={categories} />
      <Produk data={products} {...load} />
      <Contact />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { data: products } = await axios.get(
    "http://localhost:3000/api/products?limit=6&newest=true"
  );
  const { data: categories } = await axios.get(
    "http://localhost:3000/api/categories"
  );
  const { data: carousel } = await axios.get(
    "http://localhost:3000/api/carousel"
  );
  const { data: populer } = await axios.get(
    "http://localhost:3000/api/populer"
  );
  return { props: { products, categories, carousel, populer } };
}
