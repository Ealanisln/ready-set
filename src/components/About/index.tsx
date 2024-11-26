import Image from "next/image";

const About = () => {
  return (
    <section
      id="about"
      className="bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="wow fadeInUp" data-wow-delay=".2s">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 max-w-[540px] lg:mb-0">
                <h2 className="mb-5 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]">
                  Ready Set: Your favorite restaurant&apos;s go-to logistics partner for catered delivery since 2019. 
                </h2>
                <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
                  Ready Set HQ is in the beautiful San Francisco-Bay Area, expanding across Atlanta, GA and Austin, TX with plans to scale in one of the most challenging markets, the Big Apple. For your daily on-site team lunches, corporate events, and special occasions, we&apos;ve got you covered. We&apos;re proud to have served top tech giants like Apple, Google, Facebook, and Netflix, and we&apos;re committed to providing the highest quality food and timely delivery.
                </p>
                
                <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
                  When the world changed due to the pandemic, we adapted. We partnered with local flower shops to bring joy and beauty to people&apos;s homes, even during the toughest times. Our team of virtual assistants helped these businesses manage orders, dispatch drives, and stay organized. Ready Set could not have weathered the storm without them!
                </p>

                <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
                  As the world began to heal, we returned to our roots of catering delivery. But we couldn&apos;t forget about all the amazing and skilled virtual assistants we&apos;d worked with to carry Ready Set to the next level. We saw an opportunity to help even more businesses thrive, and so Ready Set VA was born. Now Ready Set is empowering businesses of all sizes with top-notch virtual assistance to help businesses grow.
                </p>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="relative h-[500px] w-full">
                <Image
                  src="/images/about/hexagon-image.png"
                  alt="about image"
                  fill
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;