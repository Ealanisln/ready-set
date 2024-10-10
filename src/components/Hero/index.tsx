import Image from "next/image";
import Link from "next/link";
import { CarouselPlugin } from "../Carousel";
import CirclePattern from "../Auth/SignUp/ui/CirclePattern";
import CirclePatternSecond from "../Auth/SignUp/ui/CirclePatternSecond";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-[120px] dark:bg-gray-900 md:pt-[130px] lg:pt-[160px]"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="w-full">
            <div
              className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center"
              data-wow-delay=".2s"
            >
              {/* Logo */}
              <div className="mx-auto mb-24 max-w-md">
                <Image
                  src="/images/logo/light-logo.png"
                  alt="Ready Set Logo"
                  width={400}
                  height={150}
                  className="h-auto w-full object-contain dark:hidden"
                />
                <Image
                  src="/images/logo/dark-logo.png"
                  alt="Ready Set Logo"
                  width={400}
                  height={150}
                  className="hidden h-auto w-full object-contain dark:block"
                />
              </div>

              <ul className="mb-8 flex flex-wrap items-center justify-center gap-5">
                {" "}
                {/* Reduced top margin */}
                <li>
                  <Link
                    href="/catering-request"
                    className="inline-flex items-center justify-center rounded-md bg-custom-yellow px-7 py-[14px] text-center text-base font-medium text-dark shadow-1 transition duration-300 ease-in-out hover:bg-yellow-400 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-500"
                  >
                    Let&apos;s Start
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    target="_blank"
                    className="flex items-center gap-4 rounded-md bg-gray-100 px-6 py-[14px] text-base font-medium text-dark transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18,16 C20.20915,16 22,14.20915 22,12 C22,9.79085 20.20915,8 18,8" />
                      <path d="M6,8 C3.79086,8 2,9.79085 2,12 C2,14.20915 3.79086,16 6,16" />
                      <path d="M6,16 L6,15.75 L6,14.5 L6,12 L6,8 C6,4.68629 8.6863,2 12,2 C15.3137,2 18,4.68629 18,8 L18,16 C18,19.3137 15.3137,22 12,22" />
                    </svg>
                    Contact us
                  </Link>
                </li>
              </ul>

              <div>
                <p className="text-center text-base font-medium text-gray-600 dark:text-gray-400">
                  Want to be part of our network? <br />
                  <Link
                    href="/signup"
                    className="font-semibold text-custom-yellow hover:underline dark:text-yellow-400"
                  >
                    Join Us
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 w-full px-4">
            <div
              className="wow fadeInUp relative z-10 mx-auto max-w-[845px]"
              data-wow-delay=".25s"
            >
              <div className="mt-8">
                <div className="flex justify-center pb-4">
                  <CarouselPlugin />
                </div>
              </div>
              <div className="absolute -left-9 bottom-0 z-[-1]">
                <CirclePattern className="fill-gray-100 dark:fill-gray-800" />
              </div>
              <div className="absolute -right-6 -top-6 z-[-1]">
                <CirclePatternSecond
                  numCircles={12}
                  offsetX={2.288}
                  offsetY={38.0087}
                  cols={3}
                  width={29}
                  height={40}
                  viewBox="0 0 29 40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
