import Image from "next/image";
import Link from "next/link";
import { CarouselPlugin } from "../Carousel";
import CirclePattern from "../Auth/SignUp/ui/CirclePattern";
import CirclePatternSecond from "../Auth/SignUp/ui/CirclePatternSecond";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden bg-yellow-400 pt-[120px] md:pt-[130px] lg:pt-[160px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div
                className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center"
                data-wow-delay=".2s"
              >
                <h1 className="mb-6 text-3xl font-bold leading-snug text-black sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                  Ready Set
                </h1>
                <p className="mx-auto mb-9 max-w-[600px] text-base font-medium text-black sm:text-lg sm:leading-[1.44]">
                  Always ready for you.
                </p>
                <ul className="mb-10 flex flex-wrap items-center justify-center gap-5">
                  <li>
                    <Link
                      href="/catering-request"
                      className="inline-flex items-center justify-center rounded-md bg-white px-7 py-[14px] text-center text-base font-medium text-dark shadow-1 transition duration-300 ease-in-out hover:bg-gray-2"
                    >
                      Let&apos;s Start
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      target="_blank"
                      className="flex items-center gap-4 rounded-md bg-white/[0.12] px-6 py-[14px] text-base font-medium text-white transition duration-300 ease-in-out hover:bg-white hover:text-dark"
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
                  <p className="mb-4 text-center text-base font-medium text-white/60">
                    Want to be part of our network? <br />
                    <Link
                      href="/signup"
                      className="font-semibold text-white hover:underline"
                    >
                      Join Us
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full px-4">
              <div
                className="wow fadeInUp relative z-10 mx-auto max-w-[845px]"
                data-wow-delay=".25s"
              >
                <div className="mt-16">
                  <div className="flex justify-center pb-4">
                    <CarouselPlugin />
                  </div>
                </div>
                <div className="absolute -left-9 bottom-0 z-[-1]">
                  <CirclePattern className="fill-white" />
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
    </>
  );
};

export default Hero;
