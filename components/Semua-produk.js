import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  IoArrowUpOutline,
  IoChevronDown,
  IoChevronDownOutline,
  IoChevronUp,
  IoChevronUpOutline,
  IoSearch,
  IoSkullOutline,
} from "react-icons/io5";
import bgProduk from "../public/bg-search.jpg";
import Button from "./Button";
import arrow from "../public/arrow.svg";
import ProductCard from "./Cards/Product-card";
import ModalBox from "./ModalBox";
import axios from "axios";
import { useRouter } from "next/router";

const Products = ({ products: data = [], categories, tags }) => {
  const [showModal, setShowModal] = useState(false);
  const [produk, setProduk] = useState({});
  const [products, setProducts] = useState(data);
  const [filters, setFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
  const [filtratedProducts, setFiltratedProducts] = useState([]);
  const formFilter = useRef();
  const productSection = useRef();
  const router = useRouter();
  const max_view = 12;
  const getData = async () => {
    const { data } = await axios.get("/api/products?newest=true");
    return data;
  };
  const filter = {};
  const { category, tag } = router.query;
  useEffect(() => {
    window.onscroll = () => {
      productSection.current.offsetTop < window.scrollY
        ? setShowToTop(true)
        : setShowToTop(false);
    };
  });
  useEffect(() => {
    setProducts(filtratedProducts.slice(0, max_view));
  }, [filtratedProducts]);
  useEffect(() => {
    if (
      filtratedProducts.length > max_view &&
      filtratedProducts.length == products.length
    ) {
      setIsExpand(true);
    }
  }, [products]);
  useEffect(() => {
    getData().then((res) => {
      setFiltratedProducts(res);
    });
    if (category) {
      Object.assign(filter, { category: [category] });
    }
    if (tag) {
      Object.assign(filter, { tags: [tag] });
    }
    if (Object.keys(filter).length != 0) {
      filterProducts(filter).then((res) => setFiltratedProducts(res));
    } else {
      const limit = data.slice(0, max_view);
      setProducts(limit);
    }
    const filterItem = [
      { name: "Category", id: 1, fold: false, dropdown: categories },
      { name: "Tags", id: 2, fold: true, dropdown: tags },
    ];
    setFilters(filterItem);
  }, []);

  const showMore = () => {
    if (isExpand) {
      setIsExpand(false);
      setProducts(filtratedProducts.slice(0, max_view));
    } else if (filtratedProducts.length > products.length) {
      const limit = filtratedProducts.slice(
        products.length,
        products.length + max_view
      );
      setProducts([...products, ...limit]);
    }
  };

  const filterProducts = async (json) => {
    const raw = await getData();
    let filteredProducts = [];
    if (json.hasOwnProperty("category")) {
      json.category.map((key) => {
        filteredProducts = [
          ...filteredProducts,
          ...raw.filter(
            (product) => product.category.toLowerCase() == key.toLowerCase()
          ),
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
          if (
            product.tags
              .map((tag) => tag.name.toLowerCase())
              .includes(tag.toLowerCase())
          ) {
            filteredTags.push(product);
          }
        });
        filteredProducts = filteredTags;
      });
    }
    return filteredProducts;
  };

  const orderByPopularity = async (e) => {
    if (!e.target.checked) return;
    const { data: popularity } = await axios("/api/products?populer=true");
    setFiltratedProducts(popularity);
    setProducts(popularity.slice(0, max_view));
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
    setFiltratedProducts(filteredProducts);
    setProducts(filteredProducts.slice(0, max_view));
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
    setFilters(newFilter);
  };

  const filterCustom = () => {
    let filteredCustom = [];
    filtratedProducts.map((product) => {
      if (
        product.tags.map((tag) => tag.name.toLowerCase()).includes("custom")
      ) {
        filteredCustom.push(product);
      }
    });
    setProducts(filteredCustom.slice(0, max_view));
    setFiltratedProducts(filteredCustom);
  };
  const showModalBox = (e) => {
    const id = e.target.dataset.id;
    const [filtered] = data.filter((item) => id == item.id);
    setProduk(filtered);
    setShowModal(true);
  };

  const searchProducts = async (e) => {
    if (!/\S/.test(e.target.value)) return;
    const keyword = e.target.value.trim();
    if (keyword)
      try {
        const { data: result } = await axios.get(
          "/api/products?search=" + keyword
        );
        if (result.length > max_view) setProducts(result.slice(0, max_view));
        else setProducts(result);
        setFiltratedProducts(result);
      } catch (err) {
        console.log("something error");
      }
    else {
      const result = await getData();
      setFiltratedProducts(result);
    }
  };

  return (
    <section id="products" data-nav="Produk" className="mt-20 bg-[#f8f8f8]">
      {showToTop && (
        <div className="fixed z-50 md:bottom-14 md:right-32 bottom-5 right-5">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-white text-primary p-3 rounded-full shadow-md">
            <IoArrowUpOutline className="text-2xl" />
          </button>
        </div>
      )}
      <div className="search-area md:h-fit h-52 block">
        <div className="relative h-full after:w-full after:backdrop-blur-sm after:top-0 after:h-full after:bg-[#9B9B9B]/60 after:block after:absolute">
          <div className="absolute z-10 w-full h-full justify-center flex items-center">
            <span>
              <form action="" className="justify-center flex">
                <input
                  onChange={searchProducts}
                  type="text"
                  name="produk"
                  id="produk"
                  className="inline-block  h-fit md:w-[450px] py-[9px] px-7 rounded-l-full focus:outline-none focus:ring-2 focus:ring-lightBlue text-base font-sourceSans text-tint"
                  placeholder="Cari di Produk..."
                  autoComplete="off"
                />
                <Button className="py-2 md:py-[9px] md:pr-7 pr-5 pl-4 text-base font-sourceSans rounded-l-none rounded-r-full">
                  <IoSearch className="inline-block text-2xl md:text-xl md:mr-1" />
                  <span className="md:inline-block hidden">{" Cari"}</span>
                </Button>
              </form>
              <div className="mt-1 md:ml-7 text-white md:text-sm text-xs font-sourceSans font-semibold flex gap-1 md:gap-2">
                <p>Populer : </p>
                <a href="?category=undangan">Undangan</a>
                <p>|</p>
                <a href="?category=kalender">Kalender</a>
                <p>|</p>
                <a href="?category=pin / bros">Pin / Bros</a>
                <p>|</p>
                <a href="?category=undangan digital">Undangan Digital</a>
              </div>
            </span>
          </div>
          <Image
            src={bgProduk}
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="md:container mx-5">
        {category || tag ? null : (
          <div className="md:mx-3 md:p-3 items-center p-2 rounded font-sourceSans h-fit flex gap-2 mt-5 bg-white relative">
            <button
              onClick={() => {
                setShowFilter(!showFilter);
              }}
              className="border-on border-2 flex items-center rounded px-3 py-1 ">
              <span className="text-on md:text-base text-sm font-semibold inline-block">
                {" Filter"}
              </span>
              <span>
                <IoChevronDown
                  className={`stroke-on rounded-lg ${
                    showFilter ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
            </button>
            <span className="h-8 border-l-2 border-on"></span>
            <div
              className={` outer-category w-full md:h-9 h-8 relative scrollbar-hide overflow-x-scroll font-sourceSans scroll-smooth`}>
              <ul className="flex top-0 z-10 absolute w-max gap-2 left-0 ">
                <li className="flex items-center">
                  <input
                    onChange={async (e) => {
                      const newest = await getData();
                      if (e.target.checked) {
                        setProducts(newest.slice(0, max_view));
                        setFiltratedProducts(newest);
                        formFilter.current.reset();
                      }
                    }}
                    type="radio"
                    defaultChecked
                    name="filtering"
                    id="terbaru"
                    className="hidden peer"
                  />
                  <label
                    htmlFor="terbaru"
                    className="border-2 cursor-pointer border-on  bg-white text-on  peer-checked:border-on font-semibold peer-checked:bg-on md:text-base text-sm peer-checked:text-white rounded px-3 py-1">
                    Terbaru
                  </label>
                </li>
                <li className="flex items-center">
                  <input
                    onChange={orderByPopularity}
                    type="radio"
                    name="filtering"
                    id="Populer"
                    className="hidden peer"
                  />
                  <label
                    htmlFor="Populer"
                    className="border-2 cursor-pointer border-on  bg-white text-on  peer-checked:border-on font-semibold peer-checked:bg-on md:text-base text-sm peer-checked:text-white rounded px-3 py-1">
                    Populer
                  </label>
                </li>
                <li className="flex items-center">
                  <input
                    onChange={(e) => {
                      if (e.target.checked) {
                        filterCustom();
                      }
                    }}
                    type="radio"
                    name="filtering"
                    id="Custom"
                    className="hidden peer"
                  />
                  <label
                    htmlFor="Custom"
                    className="border-2 cursor-pointer border-on  bg-white text-on  peer-checked:border-on font-semibold peer-checked:bg-on md:text-base text-sm peer-checked:text-white rounded px-3 py-1">
                    Custom
                  </label>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                setProducts([...products.reverse()]);
              }}
              className="text-on hidden font-semibold font-sourceSans md:text-base text-sm md:flex items-center rounded pr-4">
              <span className="mr-[2px]">Urutkan</span>
              <Image src={arrow} alt="arrowimg" />
            </button>
          </div>
        )}
      </div>
      <form onSubmit={handleFilter} ref={formFilter}>
        <div className={`relative container ${showFilter ? "" : "hidden"}`}>
          <div className="absolute pt-5  bg-white rounded-sm top-5 z-10 border-[1px] border-[#cacaca] ">
            <div className="flex px-6 items-center mb-5">
              <h3 className="text-[#262626] text-lg font-semibold font-sourceSans ">
                Filters
              </h3>
              <span className="ml-16">
                <button
                  type="reset"
                  className="text-sm font-sourceSans text-on">
                  Clear all
                </button>
                <span className="text-sm ml-2 font-sourceSans text-on">-</span>
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
                    item.fold && filters.length - 1 != i ? "border-b-[1px]" : ""
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

      {category || tag ? (
        <div className="container mx-auto">
          <div className="flex justify-between py-2 mx-3 rounded-sm mt-5 bg-white">
            <h1 className="items-center mx-5 font-sourceSans text-solid-slate text-lg">
              {category
                ? "Kategori : " + category
                : tag
                ? "Tag : " + tag
                : null}
            </h1>
            <Link
              href="/produk"
              onClick={() => {
                setProducts(data);
              }}
              className="text-base font-semibold font-sourceSans text-on mx-5">
              Tampilkan semua
            </Link>
          </div>
        </div>
      ) : null}

      {products.length == 0 && (
        <div className="mr-10 w-full flex flex-col justify-center items-center text-center my-52">
          <IoSkullOutline className="stroke-smoother-slate text-xl" />
          <p className="w-full font-sourceSans text-lg text-smoother-slate ">
            Products Not Found
          </p>
        </div>
      )}

      <div
        ref={productSection}
        className=" container flex flex-wrap mt-2 justify-between md:justify-center md:gap-4 gap-1 md:mx-auto pb-6">
        {products.map((x) => (
          <ProductCard
            className={
              "md:w-[23%] w-[49%] h-[260px] md:h-[300px] shadow-md mt-2"
            }
            key={x.id}
            data-id={x.id}
            onClick={showModalBox}>
            <ProductCard.Image
              src={x.imageUrl}
              alt="undangan 1"
              height="md:h-[65%] h-[60%]"
            />
            <ProductCard.Category>{x.category}</ProductCard.Category>
            <ProductCard.Title>{x.name}</ProductCard.Title>
            <ProductCard.Tags>
              {x.tags.map((tag) => (
                <span key={tag.id}>{tag.name}</span>
              ))}
            </ProductCard.Tags>
            <ProductCard.Price>
              {"Rp " + x.harga.toLocaleString("id-ID")}
            </ProductCard.Price>
          </ProductCard>
        ))}
      </div>
      <ModalBox
        data={produk}
        setShowModal={setShowModal}
        showModal={showModal}
      />

      {filtratedProducts.length > max_view && (
        <div className="flex container justify-center mt-4 pb-12">
          <button
            onClick={showMore}
            className="justify-center text-center flex flex-col font-sourceSans font-semibold text-off">
            <p>Lihat Lebih {isExpand ? "Sedikit" : "Banyak"}</p>
            <span className="mx-auto">
              {isExpand ? (
                <IoChevronUpOutline className="text-3xl font-light" />
              ) : (
                <IoChevronDownOutline className="text-3xl font-light" />
              )}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

export default Products;
