import Image from "next/image";
import Layout from "../../components/admin/layout";
import { withAuth } from "../../components/HOC/Auth";
import {
  IoAddCircleOutline,
  IoCreateOutline,
  IoDuplicateOutline,
  IoFilter,
  IoSkullOutline,
  IoTrash,
  IoTrashBin,
  IoTrashBinOutline,
} from "react-icons/io5";
import { useEffect, useState } from "react";
import ModalCategories from "../../components/admin/modal/modalCategories";
import cookies from "next-cookies";
import axios from "axios";
import Loading from "../../components/loading";
import { getAllCkbx } from "../../components/admin/utils";

const Categories = ({ data = [], token }) => {
  const [update, setUpdate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(data);
  const [isCheck, setIsCheck] = useState(false);
  const properties = {
    showModal,
    setShowModal,
    token,
    setUpdate,
    update,
    categories,
    setCategories,
  };
  const ckbxChange = (e) => {
    const checked = getAllCkbx("category").checked;
    if (checked.includes(false)) setIsCheck(false);
    else setIsCheck(true);
  };
  const deleteFunc = async ({ image, id, name }) => {
    return new Promise(async (resolve, reject) => {
      try {
        await axios.delete("/api/categories/delete/" + id, {
          data: { image: image },
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        resolve({ id, name });
      } catch (err) {
        reject({ id, name });
      }
    });
  };
  const deleteMultiple = async () => {
    const { items } = getAllCkbx("category");
    if (items.length == 0) {
      return alert("select category");
    }
    if (!confirm("delete selected products ?")) return;
    try {
      const promise = items.map((item) => {
        return deleteFunc(item);
      });
      const statuses = await Promise.allSettled(promise);
      const fullField = [];
      const rejected = [];
      statuses.map((prom) =>
        prom.status == "fulfilled"
          ? fullField.push(prom.value.id)
          : rejected.push(prom.reason.name)
      );

      const newCategories = [];
      categories.map(
        (category) =>
          !fullField.includes(`${category.id}`) && newCategories.push(category)
      );
      setCategories(newCategories);
      if (rejected.length > 0)
        return alert(
          `tidak dapat menghapus kategori "${rejected.map(
            (name) => " " + name
          )}" karena sedang digunakan`
        );
    } catch (err) {
      alert("Ups!!! something error :(");
    }
  };
  const search = async (e) => {
    const keyword = e.target.value.trim();
    if (keyword) {
      const { data: result } = await axios.get(
        "/api/categories?search=" + keyword
      );
      setCategories(result);
    } else {
      setCategories(data);
    }
  };
  const deleteCategory = async ({ image, id }) => {
    try {
      setLoading(true);
      await axios.delete("/api/categories/delete/" + id, {
        data: { image: image },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setCategories(categories.filter((category) => category.id != id));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err.response.data == "ER_ROW_IS_REFERENCED_2")
        alert("tidak dapat menghapus kategori yg digunakan");
    }
  };
  return (
    <Layout title="Category">
      <ModalCategories {...properties} />
      {loading ? <Loading /> : null}
      <h1 className=" text-2xl font-semibold text-solid-slate font-sourceSans">
        Kategori Produk
      </h1>
      <div className="flex flex-row w-full gap-3">
        <div className="flex flex-col w-3/5">
          <div className="menu flex flex-col items-start w-full gap-4 mt-8">
            <div className="search-menu flex">
              <input
                onChange={search}
                type="search"
                name="searchCategories"
                id="searchCategories"
                placeholder="Search for category"
                className="focus-within:outline-none placeholder:text-smoother-slate w-96
                 border-smoother-slate/20 border-2 px-3 py-2 rounded-lg text-smooth-slate bg-gray/30 focus-within:border-2 focus-within:border-secondary"
              />
              <div className="ml-5 flex">
                <span className="ml-2 flex items-center">
                  <abbr title="Filter">
                    <IoFilter
                      fill="#5a719d"
                      className="text-2xl hover:fill-solid-slate cursor-pointer"
                    />
                  </abbr>
                </span>
                <span
                  onClick={deleteMultiple}
                  className=" ml-6 flex items-center">
                  <abbr title="Delete">
                    <IoTrashBinOutline
                      stroke="#5a719d"
                      className="text-2xl [&>path]:stroke-[40px] [&>rect]:stroke-[40px] hover:stroke-solid-slate cursor-pointer"
                    />
                  </abbr>
                </span>
                <span className=" ml-6 flex items-center">
                  <abbr title="Add multiple">
                    <IoDuplicateOutline
                      stroke="#5a719d"
                      className="text-2xl [&>path]:stroke-[40px] [&>rect]:stroke-[40px] hover:stroke-solid-slate cursor-pointer"
                    />
                  </abbr>
                </span>
                <span
                  className=" ml-6 flex items-center"
                  onClick={() => {
                    setShowModal(true);
                    setUpdate("");
                  }}>
                  <abbr title="Add">
                    <IoAddCircleOutline
                      stroke="#5a719d"
                      className="text-2xl [&>path]:stroke-[40px] [&>rect]:stroke-[40px] hover:stroke-solid-slate cursor-pointer"
                    />
                  </abbr>
                </span>
              </div>
            </div>
          </div>
          {categories.length != 0 ? (
            <div className="my-5 w-full flex">
              <table className="table-auto border-collapse divide-y divide-smoother-slate/50 w-full">
                <thead className="bg-gray">
                  <tr>
                    <th className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                      <div className="flex item-center">
                        <input
                          onChange={(e) => {
                            setIsCheck(!isCheck);
                            const ckbx = getAllCkbx("category").rawNode;
                            const value = e.target.checked;
                            ckbx.forEach((item) => {
                              item.checked = value;
                            });
                          }}
                          checked={isCheck}
                          type="checkbox"
                          name="checkAll"
                          className="w-4 h-4"
                        />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                      #
                    </th>
                    <th
                      scope="col"
                      className="text-start p-4 w-[90px] text-sm font-sourceSans font-medium text-solid-slate uppercase">
                      Image
                    </th>

                    <th
                      scope="col"
                      className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                      Category
                    </th>
                    <th
                      scope="col"
                      className="text-start p-4 w-[190px] text-sm font-sourceSans font-medium text-solid-slate uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-light-gray divide-y-2 bg-white ">
                  {categories.map((category, i) => (
                    <tr className="hover:bg-gray" key={category.id}>
                      <td className="w-4 p-4">
                        <input
                          onChange={ckbxChange}
                          type="checkbox"
                          name="category"
                          id={category.id}
                          data-image={category.image}
                          data-name={category.name}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-4 w-12 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {i + 1}
                      </td>
                      <td className="pl-4 py-1 w-28">
                        <Image
                          src={`${category.imageUrl}`}
                          className="w-[80px] h-[45px] object-cover"
                          width={300}
                          height={300}
                          alt={category.name}
                        />
                      </td>

                      <td className="p-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {category.name}
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap flex">
                        <button
                          onClick={() => {
                            setUpdate(category);
                            setShowModal(true);
                          }}
                          className="flex rounded-md text-sm items-center gap-1 bg-primary py-1 font-sourceSans font-semibold text-white px-2">
                          <span>
                            <IoCreateOutline className="[&>path]:stroke-[50px]" />
                          </span>
                          Update
                        </button>
                        <button
                          className="flex rounded-md text-sm items-center gap-1 bg-red-500 py-1 font-sourceSans font-semibold text-white px-2"
                          onClick={() => {
                            if (
                              !confirm(`Delete Category "${category.name}" ?`)
                            )
                              return;
                            deleteCategory({
                              id: category.id,
                              image: category.image,
                            });
                          }}>
                          <span>
                            <IoTrash />
                          </span>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mr-10 w-full flex flex-col justify-center items-center text-center mt-44">
              <IoSkullOutline className="stroke-smoother-slate text-xl" />
              <p className="w-full font-sourceSans text-lg text-smoother-slate ">
                Categories Not Found
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;

export const getServerSideProps = withAuth(async (ctx) => {
  const { token } = cookies(ctx);
  try {
    const result = await fetch("http://localhost:3000/api/categories", {
      method: "get",
    });
    const data = await result.json();
    return { props: { data, token } };
  } catch (err) {
    console.log(err);
  }
});
