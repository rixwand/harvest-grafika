const Loading = () => {
  return (
    <>
      <div className="justify-center md:px-0 px-8 items-center shadow-md flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[60] outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="bg-white p-8 rounded-md">
            <div className="animation flex gap-2 h-12">
              <span className="block-1 w-4 h-12 bg-primary block animate-stretch"></span>
              <span className="block-2 w-4 h-12 bg-primary/50 block animate-stretch2"></span>
              <span className="block-3 w-4 h-12 bg-primary/30 block animate-stretch3"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-50 bg-black"></div>
    </>
  );
};

export default Loading;
