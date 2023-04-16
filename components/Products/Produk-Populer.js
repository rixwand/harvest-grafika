import React from "react";
import PopularCard from "../Cards/Popular-card";

const ProdukPopuler = ({ data: populer = [] }) => {
  return (
    <section id="populer" data-nav="Terlaris" className="bg-gray pt-4 pb-16">
      <h2 className="text-center md:text-[24px] text-xl pt-3 md:pt-0 font-inter font-semibold text-heading">
        Yang Sedang Populer
      </h2>
      <div className="md:w-[70px] md:h-2 w-14 h-1 rounded-full bg-darkBlue mx-auto md:mt-3 mt-1"></div>
      <div className="flex flex-wrap  justify-center gap-4 container mt-6 ">
        {populer.map((pop) => (
          <PopularCard key={pop.id} image={pop.imageUrl} title={pop.name} />
        ))}
      </div>
    </section>
  );
};

export default ProdukPopuler;
