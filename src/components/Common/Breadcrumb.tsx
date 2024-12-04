import Link from "next/link";

const Breadcrumb = ({
  pageName,
  pageDescription,
}: {
  pageName: string;
  pageDescription?: string;
}) => {
  return (
    <>
      <div 
        className="relative z-10 overflow-hidden pb-[60px] pt-[120px] md:pt-[130px] lg:pt-[160px] bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/header/header-bg.png')"
        }}
      >
        <div className="from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3 absolute bottom-0 left-0 h-px w-full bg-gradient-to-r"></div>
        <div className="container relative">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  {pageName}
                </h1>
                {/* <p className="mb-5 text-base text-gray-800">
                  {pageDescription}
                </p> */}

                <ul className="flex items-center justify-center gap-[10px]">
                  <li>
                    <Link
                      href="/"
                      className="flex items-center gap-[10px] text-base font-medium text-gray-900 hover:text-gray-700"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <p className="flex items-center gap-[10px] text-base font-medium text-gray-800">

                      {pageDescription}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Breadcrumb;