import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoClose, IoImageOutline } from "react-icons/io5";
import Loading from "../../loading";

const ModalCarousel = ({
  showModal = false,
  setShowModal,
  token,
  setSlides,
  slides,
  update,
  setUpdate,
}) => {
  const [imageSelected, setImageSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    title: "",
    desc: "",
  });
  useEffect(() => {
    if (update) {
      setFields({ title: update.title, desc: update.desc });
      setImageSelected(update.imageUrl);
    }
  }, [update]);
  const inputImage = useRef();
  const showImage = (e) => {
    setImageSelected(URL.createObjectURL(e.target.files[0]));
  };

  const fieldHandler = (e) => {
    const name = e.target.getAttribute("name");
    setFields({
      ...fields,
      [name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const files = formData.get("image");
    try {
      if (!fields.title) return alert("please add title for carousel");
      if (!fields.desc) return alert("please add description for carousel");
      if (!imageSelected) return alert("please choose an image for carousel");
      setLoading(true);
      const method = update ? "PUT" : "POST";
      const { data } = await axios({
        method,
        url: `/api/carousel/${update ? "update/" + update.id : "create"}`,
        data: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setLoading(false);
      setImageSelected("");
      inputImage.current.value = "";
      setFields({
        title: "",
        desc: "",
      });
      setShowModal(false);
      if (update) {
        const newSlides = slides.map((slide) =>
          slide.id == update.id ? data : slide
        );
        setSlides(newSlides);
      } else {
        setSlides([...slides, data]);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <>
      {showModal ? (
        <>
          {loading ? <Loading /> : null}
          <div className="justify-center md:w-fit mx-auto w-screen md:px-0 px-5 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-30 ">
            <div className="bg-white rounded-md px-10 py-7 relative md:w-fit mx-auto w-full">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFields({ title: "", desc: "" });
                  setImageSelected("");
                }}
                className="absolute top-2 right-2 text-2xl rounded-full text-rose-500">
                <IoClose />
              </button>
              <form
                action=""
                onSubmit={submitHandler}
                encType="multipart/form-data">
                <h1 className="font-sourceSans w-full font-semibold text-solid-slate text-lg mb-4 text-center">
                  Add New Carousel
                </h1>
                <div className="flex mb-1 md:w-[450px] aspect-[16/7] drop-shadow-sm border border-[#cacaca]/50 bg-gray rounded-md overflow-hidden items-center ">
                  {imageSelected ? (
                    <Image
                      src={imageSelected}
                      alt="undangan"
                      width={350}
                      height={350}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p
                      onClick={() => {
                        inputImage.current.click();
                      }}
                      className="flex flex-col font-sourceSans text-smoother-slate text-lg justify-center items-center w-full h-full cursor-pointer">
                      <span className="text-3xl">
                        <IoImageOutline />
                      </span>
                      Select image
                    </p>
                  )}
                  {update ? (
                    <input
                      type="hidden"
                      value={update.image}
                      name="oldImage"
                      readOnly
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
                <div className="flex flex-col gap-2 mt-2 w-full items-center">
                  <input
                    value={fields.title}
                    onChange={fieldHandler}
                    autoComplete="off"
                    type="text"
                    name="title"
                    id="title"
                    className="focus-within:outline-none w-full focus:border-primary flex border-[#e6eeff] border-2 rounded-lg bg-gray text-[#324567] placeholder:text-[#5a719d] placeholder:font-light py-2 px-3 font-sourceSans "
                    placeholder="Type carousel title"
                  />
                  <textarea
                    value={fields.desc}
                    onChange={fieldHandler}
                    autoComplete="off"
                    type="text"
                    name="desc"
                    id="desc"
                    className="focus-within:outline-none w-full focus:border-primary flex border-[#e6eeff] border-2 rounded-lg bg-gray text-[#324567] placeholder:text-[#5a719d] placeholder:font-light py-2 px-3 font-sourceSans "
                    placeholder="Type carousel description"
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
                      className="bg-emerald-500 hover:bg-emerald-700 font-sourceSans text-sm py-[6px] px-3 text-white rounded-md">
                      Add Carousel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-20 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default ModalCarousel;
