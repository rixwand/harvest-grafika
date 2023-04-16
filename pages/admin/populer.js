import axios from "axios";
import cookies from "next-cookies";
import React, { useEffect, useState } from "react";
import Layout from "../../components/admin/layout";
import PopularCard from "../../components/Cards/Popular-card";

const Populer = ({ data = [], categories, token }) => {
  const [populer, setPopuler] = useState([]);
  useEffect(() => {
    setPopuler(data);
  }, []);
  const cards = [];

  const updatePopuler = async (e, item) => {
    try {
      const category_id = e.target.value;
      if (!category_id) return;
      const popId = e.target.getAttribute("id");
      if (item) {
        const id = item.id;

        const { data: update } = await axios.put(
          "/api/populer/update/" + id,
          { category_id },
          { headers: { Authorization: "Bearer " + token } }
        );
        const newPop = populer.map((pop) => (pop.id == popId ? update : pop));

        setPopuler(newPop);
      } else {
        const { data } = await axios.post(
          "/api/populer/create",
          {
            id: popId,
            category_id,
          },
          { headers: { Authorization: "Bearer " + token } }
        );
        setPopuler([...populer, data]);
      }
    } catch (err) {
      if (err.response.status == 409) alert("Kategori ini sudah ada");
      console.log(err.message);
    }
  };

  const deletePopuler = async (id) => {
    try {
      await axios.delete("/api/populer/delete/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      const newPop = populer.filter((pop) => pop.id != id);
      setPopuler(newPop);
    } catch (err) {
      alert("Failed");
    }
  };
  for (let i = 1; i <= 4; i++) {
    const [item] = populer.filter((a) => a.id == i);
    cards.push(
      <div className="w-[20%]" key={i}>
        <h1 className="font-semibold text-lg text-center  text-solid-slate font-sourceSans">
          Populer {i}
        </h1>
        <select
          onChange={(e) => updatePopuler(e, item)}
          name={`populer${i}`}
          value={item ? item.category_id : ""}
          id={i}
          className="mb-2 select-icon font-sourceSans py-2 px-1 w-full text-base text-tint border-0 border-slate-300 border-b-2  bg-transparent focus:outline-none focus:ring-0 focus:border-slate-200">
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {item ? (
          <PopularCard
            className="w-full"
            image={item.imageUrl}
            title={item.name}
          />
        ) : (
          <label
            htmlFor={i}
            className="w-[235px] h-[215px] bg-gray/50 border-dashed border-2 border-slate-300 mt-3 rounded shadow-md flex justify-center items-center">
            <p className="text-sm font-sourceSans text-smoothTint/50">
              Select category populer
            </p>
          </label>
        )}

        {item ? (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => {
                confirm(`Delete kateogri populer "${item.name} ?`)
                  ? deletePopuler(item.id)
                  : null;
              }}
              className="bg-rose-600 px-3 py-1 font-semibold text-sm tracking-wide text-white rounded-md font-sourceSans">
              Delete
            </button>
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <Layout title="Populer">
      <h1 className=" text-2xl font-semibold text-solid-slate font-sourceSans">
        Populer
      </h1>
      <div className="flex mt-10 w-full pl-5 pr-16 justify-between">
        {cards.map((card) => card)}
      </div>
    </Layout>
  );
};

export default Populer;

export const getServerSideProps = async (ctx) => {
  const { token } = cookies(ctx);
  const { data } = await axios.get("http://localhost:3000/api/populer");
  const { data: categories } = await axios.get(
    "http://localhost:3000/api/categories"
  );
  return { props: { data, categories, token } };
};
