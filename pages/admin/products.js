import Image from "next/image";
import {
  IoAddCircleOutline,
  IoArrowUpOutline,
  IoChevronDown,
  IoChevronUp,
  IoCloseOutline,
  IoCreateOutline,
  IoDuplicateOutline,
  IoFilter,
  IoInformationCircleOutline,
  IoSkullOutline,
  IoTrash,
  IoTrashBin,
  IoTrashBinOutline,
  IoWarning,
} from "react-icons/io5";
import Layout from "../../components/admin/layout";
import ModalProducts from "../../components/admin/modal/modalProducts";
import { useEffect, useRef, useState } from "react";
import { withAuth } from "../../components/HOC/Auth";
import cookies from "next-cookies";
import axios from "axios";
import Loading from "../../components/loading";
import { getAllCkbx } from "../../components/admin/utils";

const Products = ({ dataProducts = [], dataCategories, dataTags, token }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(dataProducts);
  const [allProducts, setAllProducts] = useState([]);
  const [update, setUpdate] = useState();
  const [filters, setFilter] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const productSection = useRef();
  const modal = {
    showModal,
    setShowModal,
    token,
    dataTags,
    dataCategories,
    setProducts,
    products,
    update,
    setUpdate,
  };
  const max_count = 20;
  const getData = async () => {
    const { data } = await axios.get("/api/products");
    return data;
  };
  useEffect(() => {
    if (productSection.current) {
      window.onscroll = () => {
        productSection.current.offsetTop < window.scrollY
          ? setShowToTop(true)
          : setShowToTop(false);
      };
    }

    return () => {
      window.onscroll = () => {};
    };
  });

  useEffect(() => {
    if (
      allProducts.length > max_count &&
      allProducts.length == products.length
    ) {
      setIsExpand(true);
    }
  }, [products]);
  useEffect(() => {
    setProducts(allProducts.slice(0, max_count));
  }, [allProducts]);
  const showMore = () => {
    if (isExpand) {
      setIsExpand(false);
      setProducts(allProducts.slice(0, max_count));
    } else if (allProducts.length > products.length) {
      const limit = allProducts.slice(
        products.length,
        products.length + max_count
      );
      setProducts([...products, ...limit]);
    }
  };
  useEffect(() => {
    getData().then((res) => {
      setAllProducts(res);
    });
    const filterItem = [
      { name: "Category", id: 1, fold: false, dropdown: dataCategories },
      { name: "Tags", id: 2, fold: true, dropdown: dataTags },
    ];
    setFilter(filterItem);
  }, []);

  const filterProducts = async (json) => {
    const raw = await getData();
    let filteredProducts = [];
    if (json.hasOwnProperty("category")) {
      json.category.map((key) => {
        filteredProducts = [
          ...filteredProducts,
          ...raw.filter((product) => product.category == key),
        ];
      });
    } else {
      filteredProducts = raw;
    }
    let filteredTags = [];
    if (json.hasOwnProperty("tags")) {
      json.tags.map((tag) => {
        filteredProducts.forEach((product) => {
          if (filteredTags.includes(product)) return;
          if (product.tags.map((tag) => tag.name).includes(tag)) {
            filteredTags.push(product);
          }
        });
        filteredProducts = filteredTags;
      });
    }
    return filteredProducts;
  };

  const handleFilter = async (e) => {
    setShowFilter(false);
    e.preventDefault();
    const formData = new FormData(e.target);
    let keys = [];
    for (let key of formData.keys()) {
      if (keys.find((item) => item == key) == undefined) keys.push(key);
    }
    const json = {};
    keys.map((key) => {
      Object.assign(json, { [key.toLowerCase()]: formData.getAll(key) });
    });

    const filteredProducts = await filterProducts(json);
    setAllProducts(filteredProducts);
  };

  const deleteAll = () => {
    setConfirmation(true);
  };
  const passwordHandle = (e) => {
    setPassword(e.target.value);
  };

  const deleteMultiple = async () => {
    const { items } = getAllCkbx("product");
    if (items.length == 0) {
      return alert("select product");
    }
    if (!confirm("delete selected products ?")) return;
    const id = items.map((item) => item.id);
    items.map((item) => {
      deleteFunc(item);
    });
    const newProducts = [];
    allProducts.map(
      (product) => !id.includes(`${product.id}`) && newProducts.push(product)
    );
    setAllProducts(newProducts);
    isCheck && setIsCheck(false);
  };

  const ckbxChange = (e) => {
    const checked = getAllCkbx("product").checked;
    if (checked.includes(false)) setIsCheck(false);
    else setIsCheck(true);
  };

  const dropDownToggle = (e) => {
    const id = e.target.dataset.id;
    const newFilter = filters.map((item) => {
      if (item.id == id) {
        return {
          ...item,
          fold: !item.fold,
        };
      }
      return item;
    });
    setFilter(newFilter);
  };

  const searchProducts = async (e) => {
    const keyword = e.target.value.trim();
    if (keyword) {
      const { data: result } = await axios.get(
        "/api/products?search=" + keyword
      );
      if (result.length > max_count) setProducts(result.slice(0, max_count));
      else setProducts(result);
      setAllProducts(result);
    } else {
      setProducts(dataProducts);
    }
  };
  const deleteFunc = async ({ id, image }) => {
    await axios.delete("/api/products/delete/" + id, {
      data: { image },
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };
  const deleteProduct = ({ id, image }) => {
    try {
      setLoading(true);
      deleteFunc({ id, image });
      const newProducts = products.filter((product) => product.id != id);
      const newAllProducts = allProducts.filter((product) => product.id != id);
      setProducts([
        ...newProducts,
        ...allProducts.slice(max_count + 1, max_count + 2),
      ]);
      setAllProducts(newAllProducts);
      setLoading(false);
      setShowModal(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const confirmDelete = async () => {
    if (!password) return setMessage("silahkan masukkan password");
    try {
      setLoading(true);
      await axios.delete("/api/products/delete/all", {
        data: {
          password,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setAllProducts([]);
      setProducts([]);
      setMessage("");
      setPassword("");
      setLoading(false);
      setConfirmation(false);
      alert("Semua produk berhasil di hapus");
    } catch (err) {
      if (err.response.status == 403) {
        setMessage("password salah");
        setLoading(false);
      }
    }
  };
  return (
    <Layout title="Products">
      <h1 className=" text-2xl font-semibold text-solid-slate font-sourceSans">
        Semua Produk
      </h1>
      {confirmation && (
        <>
          <div className="justify-center md:px-0 px-8 items-center shadow-md flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 ">
            <div className="bg-white rounded w-1/5 px-5 py-3 relative">
              <h2 className="font-sourceSans font-semibold text-solid-slate text-lg mb-2 text-center">
                Apakah anda yakin ?
              </h2>
              <div className="warning bg-rose-500 rounded pb-1 mb-2 text-white font-sourceSans">
                <h3 className="flex items-center pt-1 px-1 font-semibold">
                  <IoWarning /> Warning!!!
                </h3>
                <p className="text-sm px-1 text-justify">
                  Tindakan ini akan menghapus seluruh data produk, dan tidak
                  dapat dikembalikan lagi
                </p>
              </div>
              <p className="font-sourceSans whitespace-normal text-left text-sm text-solid-slate pb-1">
                Demi keamanan silahkan masukkan{" "}
                <span className="font-semibold">password</span> anda untuk
                mengonfirmasi
              </p>
              <input
                type="password"
                name="password"
                id="password"
                onChange={passwordHandle}
                value={password}
                className="focus-within:outline-none focus:border-primary flex border-[#e6eeff] border-2 rounded bg-gray text-[#324567] placeholder:text-[#5a719d] placeholder:font-light py-1 px-2 font-sourceSans w-full"
                placeholder="password"
              />
              {message && (
                <p className="text-xs font-sourceSans text-rose-500 mt-1 gap-1 px-1 flex items-center">
                  <IoInformationCircleOutline /> {message}
                </p>
              )}
              <div className="flex pt-3 gap-2 justify-end">
                <button
                  type="button"
                  className="bg-emerald-500 hover:bg-emerald-600 font-sourceSans text-sm py-1 px-2 text-white rounded-sm"
                  onClick={() => {
                    setPassword("");
                    setConfirmation(false);
                    setMessage("");
                  }}>
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-rose-500 hover:bg-rose-600 font-sourceSans text-sm py-1 px-3 text-white rounded-sm">
                  Hapus Semua
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
        </>
      )}
      {showToTop && (
        <div className="fixed z-50 md:bottom-14 md:right-20 bottom-5 right-5">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-white/30 backdrop-blur-sm text-primary p-3 rounded-full shadow-md">
            <IoArrowUpOutline className="text-2xl" />
          </button>
        </div>
      )}
      {loading ? <Loading /> : null}
      <div className="menu flex h-11 w-full gap-6 justify-between items-center mt-8">
        <div className="search-menu flex">
          <input
            onChange={searchProducts}
            type="search"
            name="searchProduk"
            id="searchProduk"
            placeholder="Search for products"
            className="focus-within:outline-none placeholder:text-smoother-slate md:w-96
             border-smoother-slate/20 border-2 px-3 py-2 rounded-lg text-smooth-slate bg-gray/30 focus-within:border-2 focus-within:border-secondary"
          />
          <span className=" ml-7 flex items-center relative">
            <span onClick={() => setShowFilter(!showFilter)}>
              <abbr title="Filter">
                {showFilter ? (
                  <IoCloseOutline
                    stroke="#5a719d"
                    className="text-2xl [&>path]:stroke-[50px] [&>rect]:stroke-[40px] hover:stroke-solid-slate cursor-pointer"
                  />
                ) : (
                  <IoFilter
                    fill="#5a719d"
                    className="text-2xl hover:fill-solid-slate cursor-pointer"
                  />
                )}
              </abbr>
            </span>
            <form onSubmit={handleFilter}>
              <div
                className={`absolute container ${showFilter ? "" : "hidden"}`}>
                <div className="absolute pt-5 bg-white rounded-sm top-5 -left-7 z-10 border-[1px] border-[#cacaca] ">
                  <div className="flex px-6 items-center mb-5 w-[288px]">
                    <h3 className="text-[#262626] text-lg font-semibold font-sourceSans ">
                      Filters
                    </h3>
                    <span className="ml-16">
                      <button
                        type="reset"
                        className="text-sm font-sourceSans text-on">
                        Clear all
                      </button>
                      <span className="text-sm ml-2 font-sourceSans text-on">
                        -
                      </span>
                      <button
                        type="submit"
                        className="text-sm ml-2 font-sourceSans text-on">
                        Save view
                      </button>
                    </span>
                  </div>
                  {filters.map((item, i) => (
                    <span className="block mb-4" key={i}>
                      <div
                        key={item.id}
                        className={` ${
                          item.fold && filters.length - 1 != i
                            ? "border-b-[1px]"
                            : ""
                        } cursor-pointer duration-300 transition-colors relative mx-6 group flex justify-between items-center  dropdown  border-[#cacaca]/50`}>
                        <span
                          className={`${
                            item.fold ? "text-[#b4b5b8]" : "text-[#262626]"
                          } text-base pb-2 flex justify-between items-center font-sourceSans w-full`}>
                          <p>{item.name}</p>
                          <span className="text-[#262626] text-base">
                            {item.fold ? <IoChevronDown /> : <IoChevronUp />}
                          </span>
                        </span>

                        <button
                          type="button"
                          data-id={item.id}
                          onClick={dropDownToggle}
                          className="absolute w-full h-full"></button>
                      </div>
                      <ul
                        className={`bg-[#f6f8fa] font-sourceSans py-1 flex flex-col gap-[2px] scrollbar-hide ${
                          item.fold ? " hidden" : ""
                        }`}>
                        {item.dropdown.map((x, i) => (
                          <li className="px-5 flex items-center gap-2" key={i}>
                            <input
                              type="checkbox"
                              name={item.name}
                              value={x.name}
                              id={x.name}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                            />
                            <label htmlFor={x.name}>{x.name}</label>
                          </li>
                        ))}
                      </ul>
                    </span>
                  ))}
                </div>
              </div>
            </form>
          </span>
          <span onClick={deleteMultiple} className=" ml-6 flex items-center">
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
            onClick={() => setShowModal(true)}>
            <abbr title="Add">
              <IoAddCircleOutline
                stroke="#5a719d"
                className="text-2xl [&>path]:stroke-[40px] [&>rect]:stroke-[40px] hover:stroke-solid-slate cursor-pointer"
              />
            </abbr>
          </span>
        </div>

        <div className="flex w-full h-fit justify-end">
          <button
            onClick={deleteAll}
            className="md:mr-8 w-fit flex whitespace-nowrap float-right rounded-md items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-[6px] font-sourceSans font-semibold text-white px-3">
            <IoTrashBin />
            <p>{"Delete All"}</p>
          </button>
        </div>
      </div>

      {products.length != 0 ? (
        <div className="pr-3 mt-6">
          <table
            ref={productSection}
            className="table-auto border-collapse divide-y divide-smoother-slate/50 w-full">
            <thead className="bg-gray">
              <tr>
                <th className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  <div className="flex item-center">
                    <input
                      onChange={(e) => {
                        const checkbox = getAllCkbx("product").rawNode;
                        e.target.checked
                          ? checkbox.forEach((ckbx) => (ckbx.checked = true))
                          : checkbox.forEach((ckbx) => (ckbx.checked = false));
                        setIsCheck(!isCheck);
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
                  Name
                </th>
                <th
                  scope="col"
                  className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  Category
                </th>
                <th
                  scope="col"
                  className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  Tags
                </th>
                <th
                  scope="col"
                  className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  Harga
                </th>
                <th
                  scope="col"
                  className="text-start p-4 w-[190px] text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-light-gray divide-y-2 bg-white ">
              {products.map((item, i) => (
                <tr className="hover:bg-gray" key={item.id}>
                  <td className="text-start pl-4 w-12 items-center text-sm font-sourceSans font-medium text-solid-slate uppercase">
                    <input
                      onChange={ckbxChange}
                      type="checkbox"
                      name="product"
                      id={item.id}
                      data-image={item.image}
                      className="w-4 h-4 mt-2"
                    />
                  </td>
                  <td className="p-4 w-12 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {i + 1}
                  </td>
                  <td className="pl-4 py-1">
                    <Image
                      src={item.imageUrl}
                      className="w-[80px] h-[45px] object-cover"
                      width={300}
                      height={300}
                      alt={item.image}
                    />
                  </td>
                  <td className="p-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {item.name}
                  </td>
                  <td className="p-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {item.category}
                  </td>
                  <td className="p-4 text-base text-solid-slate font-sourceSans tracking-tight whitespace-nowrap">
                    {item.tags.map((tag) => `${tag.name.toLowerCase()} `)}
                  </td>
                  <td className="p-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {item.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 space-x-2 whitespace-nowrap flex">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setUpdate(item);
                      }}
                      className="flex rounded-md text-sm items-center gap-1 bg-primary hover:bg-blue-700 py-1 font-sourceSans font-semibold text-white px-2">
                      <span>
                        <IoCreateOutline className="[&>path]:stroke-[50px]" />
                      </span>
                      Update
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete product ${item.name} ?`))
                          deleteProduct(item);
                      }}
                      className="flex rounded-md text-sm items-center gap-1 bg-red-500 hover:bg-red-600 py-1 font-sourceSans font-semibold text-white px-2">
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
          {allProducts.length > 20 && (
            <button
              onClick={showMore}
              className="grid justify-center w-fit mx-auto my-3">
              <span className="text-3xl">
                {isExpand ? (
                  <IoChevronUp className="stroke-on [&>path]:stroke-[50px]" />
                ) : (
                  <IoChevronDown className="stroke-on [&>path]:stroke-[50px]" />
                )}
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="mr-10 w-full flex flex-col justify-center items-center text-center mt-52">
          <IoSkullOutline className="stroke-smoother-slate text-xl" />
          <p className="w-full font-sourceSans text-lg text-smoother-slate ">
            Products Not Found
          </p>
        </div>
      )}
      <ModalProducts {...modal} />
    </Layout>
  );
};

export const getServerSideProps = withAuth(async (ctx) => {
  const { token } = cookies(ctx);
  const { data: dataProducts } = await axios(
    "http://localhost:3000/api/products?limit=20"
  );
  const { data: dataTags } = await axios("http://localhost:3000/api/tags");
  const { data: dataCategories } = await axios(
    "http://localhost:3000/api/categories"
  );
  return { props: { dataProducts, dataTags, dataCategories, token } };
});

export default Products;
