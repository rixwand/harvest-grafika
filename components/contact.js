import {
  IoLocationOutline,
  IoLogoInstagram,
  IoLogoWhatsapp,
  IoMailOutline,
} from "react-icons/io5";

const Contact = () => {
  return (
    <div>
      <div className="bg-gray pt-8 pb-16 ">
        <h2 className="text-center md:text-[24px] text-xl font-inter font-semibold text-heading">
          Hubungi Kami
        </h2>
        <div className="md:w-[70px] md:h-2 w-14 h-1 rounded-full bg-darkBlue mx-auto md:mt-3 mt-1"></div>
        <div className="container mx-auto mt-6">
          <div className="flex px-8 pt-7 justify-between">
            <a
              href="http://instagram.com/harvestgrafika"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-gradient-to-tr from-lightBlue to-darkBlue transition-all duration-300 group md:w-[23%] w-[48%] bg-white h-52 rounded-md shadow flex flex-col justify-center items-center">
              <IoLogoInstagram className="text-5xl text-blue-500 group-hover:text-white" />
              <p className="text-on font-sourceSans group-hover:text-white font-semibold">
                Instagram
              </p>
              <p className="text-on font-sourceSans group-hover:text-white font-semibold mt-1">
                @harvestgrafika
              </p>
            </a>
            <a
              href="http://wa.me/+6282311900400"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-gradient-to-tr from-lightBlue to-darkBlue transition-all duration-300 group md:w-[23%] w-[48%] bg-white h-52 rounded-md shadow flex flex-col justify-center items-center">
              <IoLogoWhatsapp className="text-5xl text-blue-500 group-hover:text-white" />
              <p className="text-on font-sourceSans group-hover:text-white font-semibold">
                WhatsApp
              </p>
              <p className="text-on font-sourceSans group-hover:text-white font-semibold mt-1">
                +6282-311-900-400
              </p>
            </a>
            <a
              href="mailto:harvestgrafika@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-gradient-to-tr from-lightBlue to-darkBlue transition-all duration-300 group md:w-[23%] w-[48%] bg-white h-52 rounded-md shadow flex flex-col justify-center items-center">
              <IoMailOutline className="text-5xl text-blue-500 group-hover:text-white" />
              <p className="text-on font-sourceSans group-hover:text-white font-semibold">
                Email
              </p>
              <p className="text-on font-sourceSans group-hover:text-white font-semibold mt-1">
                harvestgrafika@gmail.com
              </p>
            </a>
            <a
              href="https://goo.gl/maps/7Peq3WuctiqwQsMdA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-gradient-to-tr from-lightBlue to-darkBlue transition-all duration-300 group md:w-[23%] w-[48%] bg-white h-52 rounded-md shadow flex flex-col justify-center items-center">
              <IoLocationOutline className="text-5xl text-blue-500 group-hover:text-white" />
              <p className="text-on font-sourceSans group-hover:text-white font-semibold">
                Lokasi
              </p>
              <p className="text-on font-sourceSans group-hover:text-white font-semibold mt-1">
                Jl. Sukawati No.18
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
