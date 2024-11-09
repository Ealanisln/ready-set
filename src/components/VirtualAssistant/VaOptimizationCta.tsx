import Image from "next/image";
import Link from "next/link";
import AppointmentDialog from "./Appointment";

const BusinessScaleSection = () => {
  const benefits = [
    {
      imageWebp: "/images/virtual/customer-service.webp",
      imageFallback: "/images/virtual/customer-service.jpg",
      alt: "Business collaboration",
      title: "Develop a business that runs smoothly on Its own",
      description:
        "Imagine a business that grows even when you're not involved.",
    },
    {
      imageWebp: "/images/virtual/content-creation.webp",
      imageFallback: "/images/virtual/content-creation.jpg",
      alt: "Work life balance",
      title: "Unlock extra time for what you love",
      description:
        "A skilled VA can lighten your workload, giving you space to focus on what you love!",
      isFlipped: true, // Added this flag to identify which image to flip
    },
    {
      imageWebp: "/images/virtual/administrative-support.webp",
      imageFallback: "/images/virtual/administrative-support.jpg",
      alt: "Remote work setup",
      title: "Grow your wealth without the added stress!",
      description:
        "Picture your wealth growing while dedicated help manages the day-to-day, letting you relax and stay inspired.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      {/* Top Section with Venn Diagram and CTA */}
      <div className="mb-20 grid items-center gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full max-w-md">
          <Image
            src="/images/virtual/va-diagram.png"
            alt="Business scaling venn diagram showing People, Technology, and Process intersection"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-semibold">
            <span className="text-yellowd-500">Let Ready Set VAs </span>be the
            part of your business solution.
          </h2>
          <div className="space-y-4 text-lg">
            {" "}
            Don&apos;t let task lists get out of hand. We&apos;ve got you
            covered.
            <p className="text-lg">
              Ready Set is here to lighten your load, handling everything from
              routine tasks to urgent priorities—efficiently and swiftly.
              Reclaim your time with our on-demand support and watch your
              productivity soar. Let us handle the nitty gritty tasks so you can
              focus on the big picture.
            </p>
          </div>

          <AppointmentDialog
            buttonVariant="amber"
            calendarUrl="https://calendar.google.com/calendar/appointments/AcZssZ1jHb5jHQLYMdGkYHDE1Joqi0ADTQ_QVVx1HcA=?gv=true&embedded=true"
          />
        </div>
      </div>

      {/* Bottom Section with Scale Message and Images */}
      <div className="space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-semibold">
            <span className="text-yellowd-500">Build your business up </span>
            the smart way!
          </h2>
          <p className="text-xl">
            By having proper tools, efficient workflows, and expert assistance,
            you can:
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
                <picture>
                  <source srcSet={benefit.imageWebp} type="image/webp" />
                  <Image
                    src={benefit.imageFallback}
                    alt={benefit.alt}
                    fill
                    className={`object-cover ${benefit.isFlipped ? "scale-x-[-1]" : ""}`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                </picture>
              </div>
              <div className="mt-6 flex flex-col items-center space-y-4 px-4">
                <h3 className="text-center text-2xl font-bold">
                  {benefit.title}
                </h3>
                <p className="text-center text-lg text-gray-700 md:px-2">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessScaleSection;
