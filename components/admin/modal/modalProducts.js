import axios from "axios";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoClose,
  IoCloseCircle,
  IoImageOutline,
} from "react-icons/io5";
import Loading from "../../loading";

const ModalProducts = ({
  showModal = false,
  setShowModal,
  dataTags,
  dataCategories: categories = [],
  token,
  update,
  setUpdate,
}) => {
  const [imageSelected, setImageSelected] = useState("");
  const [selected, setSelected] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [showNewTags, setShowNewTags] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const inputImage = useRef();
  useEffect(() => {
    if (update) {
      setSelected(update.category_id);
      setProductPrice(update.harga);
      setProductName(update.name);
      setImageSelected(update.imageUrl);
    }
    const newTags = dataTags.map((tag) => {
      if (
        update &&
        update.tags.filter((update_tag) => update_tag.id == tag.id).length != 0
      ) {
        return { ...tag, checked: true };
      } else {
        return { ...tag, checked: false };
      }
    });
    setTags(newTags);
  }, [update]);
  const addNewTag = async () => {
    if (!newTag) return alert("Please type new tag");
    setLoading(true);
    const { data: tag } = await axios.post(
      "/api/tags/create",
      {
        tag: newTag,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    setTags([...tags, { ...tag, checked: true }]);
    setLoading(false);
    setShowNewTags(false);
    setNewTag("");
  };
  const handleSelect = (e) => {
    setSelected(e.target.value);
  };
  const handleTags = (id) => {
    const newTags = tags.map((tag) =>
      tag.id == id ? { ...tag, checked: !tag.checked } : tag
    );
    setTags(newTags);
  };
  const showImage = (e) => {
    setImageSelected(URL.createObjectURL(e.target.files[0]));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      if (!imageSelected) return alert("please choose an image");
      if (!selected) return alert("please select category");
      if (formData.getAll("tags").length == 0)
        return alert("please add a tags");
      let keys = [];
      for (let key of formData.keys()) {
        if (keys.find((item) => item == key) == undefined) keys.push(key);
      }
      const newFormData = new FormData();
      keys.map((key) => {
        if (key == "tags") {
          newFormData.append(key, formData.getAll(key));
        } else {
          newFormData.append(key, formData.get(key));
        }
      });
      const method = update ? "PUT" : "POST";
      setLoading(true);
      const { data } = await axios({
        method,
        url: `/api/products/${update ? "update/" + update.id : "create"}`,
        data: newFormData,
        headers: { Authorization: "Bearer " + token },
      });
      setLoading(false);
      setShowModal(false);

      refreshData();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const router = useRouter();
  const refreshData = () => {
    router.reload();
  };
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center md:px-0 px-8 items-center shadow-md flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 ">
            {loading ? <Loading /> : null}
            <div className="bg-white rounded-md px-6 relative">
              <button
                onClick={() => {
                  setShowModal(false);
                  setUpdate("");
                  setProductPrice("");
                  setProductName("");
                  setImageSelected("");
                  setShowTags(false);
                  setSelected("");
                }}
                className="absolute top-2 right-2 text-2xl rounded-full text-rose-500">
                <IoClose />
              </button>
              <form onSubmit={submitHandler} encType="multipart/form-data">
                <div className="flex gap-6 justify-center">
                  <div className="pt-4 flex items-start flex-col">
                    <h1 className="font-sourceSans font-semibold text-solid-slate text-lg mb-1">
                      {update ? "Edit Product" : "New Product"}
                    </h1>
                    <div className="flex h-[280px] drop-shadow-sm border border-[#cacaca]/30 bg-gray w-[280px] rounded-md overflow-hidden items-center">
                      {imageSelected ? (
                        <Image
                          src={imageSelected}
                          alt="undangan"
                          className="w-full h-full object-cover"
                          width={280}
                          height={280}
                        />
                      ) : (
                        <p
                          onClick={() => {
                            inputImage.current.click();
                          }}
                          className="flex flex-col font-sourceSans text-smoother-slate justify-center items-center w-full h-full cursor-pointer">
                          <span className="text-3xl">
                            <IoImageOutline />
                          </span>
                          Select image
                        </p>
                      )}
                      {update ? (
                        <input
                          type="text"
                          name="oldImage"
                          value={update.image}
                          readOnly
                          hidden
                        />
                      ) : null}
                      <input
                        onChange={showImage}
                        ref={inputImage}
                        type="file"
                        name="image"
                        id="image"
                        hidden
                        accept=".jpg, .jpeg, .webp, .png, .jfif, .pjpeg, .pjp, .avif"
                      />
                    </div>
                    <div className="w-full text-center mt-2">
                      <button
                        type="button"
                        className="text-2xl"
                        onClick={() => {
                          setImageSelected("");
                          inputImage.current.value = "";
                        }}>
                        <IoCloseCircle className="fill-rose-600" />
                      </button>
                    </div>
                  </div>
                  <div className="md:w-80 py-5 w-full flex flex-wrap items-center">
                    <label htmlFor="name" className="text-[#324567] ml-1">
                      Nama Produk
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      required
                      name="name"
                      onChange={(e) => setProductName(e.target.value)}
                      value={productName}
                      id="name"
                      className="focus-within:outline-none mt-1 focus:border-primary flex border-[#e6eeff] border-2 rounded-lg bg-gray text-[#324567] placeholder:text-[#5a719d] placeholder:font-light py-2 px-3 font-sourceSans w-full"
                      placeholder="Type product name"
                    />
                    <label htmlFor="price" className="text-[#324567] mt-2 ml-1">
                      Harga
                    </label>
                    <input
                      required
                      onChange={(e) => setProductPrice(e.target.value)}
                      value={productPrice}
                      autoComplete="off"
                      type="number"
                      name="harga"
                      id="price"
                      className="focus-within:outline-none mt-1 focus:border-primary flex border-[#e6eeff] border-2 rounded-lg bg-gray text-[#324567] placeholder:text-[#5a719d] placeholder:font-light py-2 px-3 font-sourceSans w-full"
                      placeholder="Rp ---"
                    />
                    <label
                      htmlFor="category"
                      className="text-[#324567] mt-2 ml-1">
                      Kategori
                    </label>
                    <select
                      required
                      onChange={handleSelect}
                      value={selected}
                      name="category_id"
                      id="category"
                      className="focus-within:outline-none mt-2 select-icon focus:border-primary border-[#e6eeff] border-2 rounded-lg bg-gray text-[#324567] py-2 px-2 font-sourceSans w-full">
                      {update ? null : <option value="">Pilih kategori</option>}

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex relative mt-4">
                      <div
                        onClick={() => {
                          setShowTags(!showTags);
                        }}
                        className={`flex cursor-pointer bg-gray ${
                          showTags ? "border-primary" : "border-[#e6eeff]"
                        } border-2 text-[#324567] py-[6px] px-3 font-sourceSans rounded-md`}>
                        Tags
                        <span className="flex items-center ml-1">
                          {showTags ? (
                            <IoChevronUpOutline />
                          ) : (
                            <IoChevronDownOutline />
                          )}
                        </span>
                      </div>
                      <div
                        className={`absolute -left-8 top-6 container ${
                          !showTags ? "hidden" : ""
                        }`}>
                        <div className="absolute bg-white rounded-sm top-4 z-10 overflow-hidden">
                          <span className="block">
                            <ul
                              className={`bg-white border-[#cacaca]/50 border max-h-[134px] rounded divide-gray divide-y font-sourceSans overflow-y-scroll flex flex-col`}>
                              <fieldset>
                                {}
                                {tags.map((tag) => (
                                  <li
                                    key={tag.id}
                                    className="flex items-center gap-2 p-4 py-1">
                                    <input
                                      onChange={() => handleTags(tag.id)}
                                      type="checkbox"
                                      name="tags"
                                      checked={tag.checked}
                                      data-name={tag.name}
                                      value={tag.id}
                                      id={`tag${tag.id}`}
                                      className="text-blue-600 bg-gray-100 border-gray-300 rounded mt-1"
                                    />
                                    <label
                                      htmlFor={`tag${tag.id}`}
                                      className="cursor-pointer font-sourceSans text-[#324567]">
                                      {tag.name}
                                    </label>
                                  </li>
                                ))}
                              </fieldset>
                            </ul>
                          </span>
                        </div>
                      </div>
                      <ul className="flex gap-1 ml-2 border-b w-[234px] pb-1 border-[#cacaca]/50 overflow-x-scroll scrollbar-hide">
                        {showNewTags ? (
                          <li className=" flex items-center rounded-md">
                            <input
                              onChange={(e) => {
                                e.target.setAttribute(
                                  "size",
                                  e.target.value.length > 3
                                    ? e.target.value.length - 3
                                    : 1
                                );
                                setNewTag(e.target.value);
                              }}
                              type="text"
                              autoFocus
                              value={newTag}
                              placeholder="tag"
                              size={1}
                              className="text-emerald-600 bg-transparent focus-within:outline-none font-sourceSans "
                            />
                          </li>
                        ) : null}
                        {tags.map((tag) => {
                          if (tag.checked) {
                            return (
                              <li
                                key={tag.id}
                                className="bg-emerald-600 text-white flex items-center px-3 font-sourceSans rounded-md">
                                {tag.name}
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </div>
                    <div className="w-full flex pt-3 gap-2 justify-end">
                      {!showNewTags ? (
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewTags(true);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 font-sourceSans py-[6px] px-3 text-white rounded">
                          New Tags
                        </button>
                      ) : (
                        <span className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewTags(false);
                              setNewTag("");
                            }}
                            className="bg-rose-500 hover:bg-rose-600 font-sourceSans py-[6px] px-3 text-white rounded">
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={addNewTag}
                            className="bg-emerald-500 hover:bg-emerald-600 font-sourceSans py-[6px] px-3 text-white rounded">
                            Add Tags
                          </button>
                        </span>
                      )}
                      <button
                        type="submit"
                        className="bg-primary hover:bg-indigo-700 font-sourceSans py-[6px] px-3 text-white rounded">
                        {update ? "Update Product" : "Add Product"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default ModalProducts;
