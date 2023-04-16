import axios from "axios";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { IoClose, IoImageOutline } from "react-icons/io5";
import Loading from "../../loading";

const ModalCategories = ({
  showModal = false,
  setShowModal,
  token,
  update,
  setUpdate,
  categories,
  setCategories,
}) => {
  const [imageSelected, setImageSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const inputImage = useRef();

  useEffect(() => {
    if (update) {
      setImageSelected(update.imageUrl);
      setCategoryName(update.name);
    }
  }, [update]);

  const showImage = (e) => {
    if (!e.target.files[0]) return;
    if (!validateImage(e.target.files[0].name))
      return alert("only support image file");
    setImageSelected(URL.createObjectURL(e.target.files[0]));
  };

  const validateImage = (name) => {
    const ext = name.split(".");
    const validExt = [
      "jpg",
      "jpeg",
      "webp",
      "png",
      "jfif",
      "pjpeg",
      "pjp",
      "avif",
    ];
    if (!validExt.includes(ext[ext.length - 1])) return false;
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      if (!imageSelected) return alert("Please choose an image");
      setLoading(true);
      const method = update ? "PUT" : "POST";
      const { data } = await axios({
        method,
        url: `/api/categories/${
          update ? "update/" + update.id : "create?name=" + formData.get("name")
        }`,
        data: formData,

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImageSelected("");
      setCategoryName("");
      setLoading(false);
      setShowModal(false);
      console.log([...categories, data]);
      setCategories([...categories, data]);
    } catch (err) {
      setLoading(false);
      if (err.response.data == "ERR_DUP_ENTRY") {
        alert("Category already exist");
      }

      console.log(err);
    }
  };
  return (
    <>
      {showModal ? (
        <>
          {loading ? <Loading /> : null}
          <div className="justify-center md:px-0 px-8 items-center shadow-md flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 ">
            <div className="bg-white rounded-md px-10 py-7 relative">
              <button
                onClick={() => {
                  setShowModal(false);
                  setUpdate("");
                  setImageSelected("");
                  setCategoryName("");
                }}
                className="absolute top-2 right-2 text-2xl rounded-full text-rose-500">
                <IoClose />
              </button>
              <form onSubmit={submitHandler} encType="multipart/form-data">
                <h1 className="font-sourceSans w-full font-semibold text-solid-slate text-lg mb-4 text-center">
                  {update ? "Edit Category" : "Add New Category"}
                </h1>
                <div className="flex gap-5">
                  <div className="flex mb-1 w-40 aspect-video drop-shadow-sm border border-[#cacaca]/50 bg-gray rounded-md overflow-hidden items-center">
                    {imageSelected ? (
                      <Image
                        src={imageSelected}
                        alt="undangan"
                        className="w-full h-full object-cover"
                        width={158}
                        height={97}
                      />
                    ) : (
                      <label
                        htmlFor="image"
                        className="flex flex-col font-sourceSans text-smoother-slate text-sm justify-center items-center w-full h-full cursor-pointer">
                        <span className="text-xl">
                          <IoImageOutline />
                        </span>
                        Select image
                      </label>
                    )}
                    <input
                      ref={inputImage}
                      onChange={showImage}
                      type="file"
                      id="image"
                      name="image"
                      hidden
                      accept=".jpg, .jpeg, .webp, .png, .jfif, .pjpeg, .pjp, .avif"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    {update ? (
                      <input
                        type="text"
                        name="oldImage"
                        hidden
                        readOnly
                        value={update.image}
                      />
                    ) : null}
                    <input
                      autoComplete="off"
                      type="text"
                      name="name"
                      id="name"
                      onChange={(e) => setCategoryName(e.target.value)}
                      value={categoryName}
                      className="focus-within:outline-none focus:border-primary flex border-[#e6eeff] border-2 rounded-lg bg-gray text-[#324567] placeholder:text-[#5a719d] placeholder:font-light py-2 px-3 font-sourceSans w-full"
                      placeholder="Type category name"
                      required
                    />
                    <div className="flex pt-[14px] gap-2 justify-center">
                      <button
                        type="button"
                        className="bg-rose-500 hover:bg-rose-600 font-sourceSans text-sm py-[6px] px-3 text-white rounded-md"
                        onClick={() => {
                          setImageSelected("");
                          inputImage.current.value = "";
                        }}>
                        Delete image
                      </button>
                      <button
                        type="submit"
                        className="bg-primary hover:bg-indigo-700 font-sourceSans text-sm py-[6px] px-3 text-white rounded-md">
                        {update ? "Update Category" : "Add category"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default ModalCategories;
