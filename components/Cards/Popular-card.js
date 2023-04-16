import Image from "next/image";
import Link from "next/link";
import React from "react";

const PopularCard = ({ image, title, className = " md:w-[23.5%] w-[48%]" }) => {
  return (
    <div
      className={
        className + "bg-white p-[10px] mt-3 rounded-md shadow-md relative"
      }>
      <span className="absolute flex w-full h-full items-center top-0 left-0 p-[10px] rounded">
        <Link
          href={"/produk?category=" + title}
          className="bg-slate-500/50 flex w-full h-1/4 backdrop-blur-sm justify-center items-center font-sourceSans text-white tracking-wider md:text-base text-sm">
          {title}
        </Link>
      </span>
      <Image
        src={image}
        width={300}
        height={300}
        className="rounded md:h-[195px] h-[130px] w-full object-cover"
        alt={title}
      />
    </div>
  );
};

export default PopularCard;
