import Layout from "../../components/admin/layout";
import Image from "next/image";
import {
  IoAddCircle,
  IoChevronBack,
  IoChevronForward,
  IoEllipse,
  IoSkullOutline,
  IoTrash,
} from "react-icons/io5";
import { useEffect, useState } from "react";
import { withAuth } from "../../components/HOC/Auth";
import { IoCreateOutline, IoTrashBin } from "react-icons/io5";
import ModalCarousel from "../../components/admin/modal/modalCarousel";
import cookies from "next-cookies";
import axios from "axios";

export const getServerSideProps = withAuth(async (ctx) => {
  const { token } = cookies(ctx);
  const { data: slides } = await axios.get(
    "http://localhost:3000/api/carousel"
  );
  return { props: { token, dataSlides: slides } };
});

const Carousel = ({ token, dataSlides }) => {
  const [showModal, setShowModal] = useState(false);
  const [slides, setSlides] = useState([]);
  const [update, setUpdate] = useState("");
  const modal = {
    showModal,
    setShowModal,
    token,
    setSlides,
    slides,
    update,
    setUpdate,
  };
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (dataSlides) setSlides(dataSlides);
  }, []);
  const prevImage = () => {
    const isFirst = index == 0;
    const newIndex = isFirst ? slides.length - 1 : index - 1;
    setIndex(newIndex);
  };
  const nextImage = () => {
    const isLast = index == slides.length - 1;
    const newIndex = isLast ? 0 : index + 1;
    setIndex(newIndex);
  };

  const deleteCarousel = async ({ id, image }) => {
    try {
      await axios.delete("/api/carousel/delete/" + id, {
        data: { image },
        headers: { Authorization: "Bearer " + token },
      });
      const newSlides = slides.filter((slide) => slide.id != id);
      setSlides(newSlides);
      alert("delete success");
    } catch (err) {
      alert("delete failed");
    }
  };

  return (
    <>
      <Layout title="Carousel">
        <ModalCarousel {...modal} />
        <h1 className=" text-2xl font-semibold text-solid-slate font-sourceSans">
          Carousel
        </h1>
        {slides.length != 0 ? (
          <div className="container flex justify-center w-full">
            <div className="justify-center sm:w-[950px] mt-5 flex shadow-lg">
              <div className="slider w-full overflow-hidden flex flex-row rounded-lg aspect-[16/8] sm:aspect-[16/5] ">
                <div className="outer-image w-full group relative">
                  <span
                    className="absolute top-[43%] cursor-pointer duration-300 transition-all group-hover:block z-10 hidden text-white/40 text-xl sm:text-4xl left-1 bg-black/40 p-1 rounded-full"
                    onClick={prevImage}>
                    <IoChevronBack />
                  </span>
                  <span
                    className="absolute top-[43%] cursor-pointer duration-300 transition-all group-hover:block z-10 hidden text-white/40 text-xl sm:text-4xl right-1 bg-black/40 p-1 rounded-full"
                    onClick={nextImage}>
                    <IoChevronForward />
                  </span>
                  <div
                    className={`flex-auto h-full flex transition-all duration-300 relative`}
                    style={{
                      transform: `translateX(-${index == 0 ? "" : index}00%)`,
                    }}>
                    {slides.map((slide, i) => {
                      return (
                        <div
                          className=" aspect-[16/8] sm:aspect-[16/5]"
                          key={slide.id}>
                          <div className="absolute flex w-full h-full flex-col sm:pt-32 pt-16 items-center bg-gradient-to-b from-transparent to-black/70">
                            <h2 className="text-white/75 sm:text-xl text-sm tracking-wider font-inter font-semibold">
                              {slide.title}
                            </h2>
                            <p className="text-white/60 leading-[10px] pt-1 font-sourceSans tracking-wider sm:text-sm text-[8px] px-12 text-center">
                              {slide.desc}
                            </p>
                          </div>
                          <Image
                            src={slide.imageUrl}
                            width={3000}
                            height={1000}
                            alt={slide.image}
                            priority={i == 0 ? true : false}
                            style={{ width: "100%" }}
                            className="object-cover w-full aspect-[16/8] sm:aspect-[16/5]"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute sm:bottom-6 bottom-3 text-[6px] sm:text-[8px] w-full justify-center flex gap-[2px]">
                    {slides.map((slide, i) => {
                      return (
                        <IoEllipse
                          className={`${
                            index == i ? "text-white" : "text-white/30"
                          }`}
                          key={slide.id}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex w-full gap-3 h-fit justify-start mt-6">
          <button className="w-fit flex whitespace-nowrap float-right rounded-md items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-[6px] font-sourceSans font-semibold text-white px-3">
            <IoTrashBin />
            <p className="">{"Delete All"}</p>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="w-fit flex whitespace-nowrap float-right rounded-md items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 py-[6px] font-sourceSans font-semibold text-white px-3">
            <IoAddCircle />
            <p className="">{"Add Carousel"}</p>
          </button>
        </div>
        <div className="pr-3 mt-3 mb-5">
          {slides.length != 0 ? (
            <table className="table-auto border-collapse divide-y divide-smoother-slate/50 w-full">
              <thead className="bg-gray">
                <tr>
                  <th className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                    <div className="flex item-center">
                      <input
                        type="checkbox"
                        name="checkAll"
                        className="w-4 h-4"
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="text-start p-4 w-[90px] text-sm font-sourceSans font-medium text-solid-slate uppercase">
                    #
                  </th>
                  <th
                    scope="col"
                    className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                    Image
                  </th>
                  <th
                    scope="col"
                    className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                    Desc
                  </th>
                  <th
                    scope="col"
                    className="text-start p-4 w-[190px] text-sm font-sourceSans font-medium text-solid-slate uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-light-gray divide-y-2 bg-white ">
                {slides.map((slide, i) => (
                  <tr className="hover:bg-gray" key={slide.id}>
                    <td className="w-4 p-4">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-4 w-3 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {i + 1}
                    </td>
                    <td className="pl-4 py-1">
                      <Image
                        src={slide.imageUrl}
                        height={300}
                        width={300}
                        className="w-[80px] h-[45px] object-cover"
                        alt="undangan.jpg"
                      />
                    </td>

                    <td className="p-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {slide.title}
                    </td>
                    <td className="p-4 text-lg text-smoother-slate font-sourceSans text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {slide.desc.length > 50
                        ? slide.desc.slice(0, 50) + "..."
                        : slide.desc}
                    </td>
                    <td className="p-4 space-x-2 whitespace-nowrap flex">
                      <button
                        onClick={() => {
                          setUpdate(slide);
                          setShowModal(true);
                        }}
                        className="flex rounded-md text-sm items-center gap-1 bg-primary hover:bg-blue-700 py-1 font-sourceSans font-semibold text-white px-2">
                        <span>
                          <IoCreateOutline className="[&>path]:stroke-[50px]" />
                        </span>
                        Update
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`delete carousel "${slide.title}" ?`))
                            deleteCarousel(slide);
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
          ) : (
            <div className="mr-10 w-full flex flex-col justify-center items-center text-center mt-52">
              <IoSkullOutline className="stroke-smoother-slate text-xl" />
              <p className="w-full font-sourceSans text-lg text-smoother-slate ">
                Carousel Not Found
              </p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Carousel;
