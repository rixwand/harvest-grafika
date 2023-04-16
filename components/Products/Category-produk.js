import React, { useEffect, useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import CategoryCard from "../Cards/Category-card";

const CategoryProduk = ({ data = [] }) => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState(data);
  const [isExpand, setIsExpand] = useState(false);
  useEffect(() => {
    isExpand
      ? setCategories(allCategories)
      : setCategories(allCategories.slice(0, 8));
  }, [isExpand]);
  return (
    <section
      id="category"
      data-nav="Kategori"
      className="bg-gray py-8 md:py-12">
      <h2 className="text-center md:text-[24px] text-xl font-inter font-semibold text-heading">
        Cek Semua Kategori
      </h2>
      <div className="md:w-[70px] md:h-2 w-14 h-1 rounded-full bg-darkBlue mx-auto md:mt-3 mt-1"></div>
      <div className="flex flex-wrap md:gap-4 gap-3 justify-center container mt-6 ">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            image={category.imageUrl}
            title={category.name}
            alt={category.image}
          />
        ))}
      </div>
      {allCategories.length > 8 ? (
        <div className="flex container justify-center mt-4">
          <button
            onClick={() => setIsExpand(!isExpand)}
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
      ) : null}
    </section>
  );
};

export default CategoryProduk;
