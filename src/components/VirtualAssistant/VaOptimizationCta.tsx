import Image from "next/image";
import Link from "next/link";
import AppointmentDialog from "./Appointment";

const BusinessScaleSection = () => {
  const benefits = [
    {
      imageWebp: "/images/virtual/customer-service.webp",
      imageFallback: "/images/virtual/customer-service.jpg",
      alt: "Business collaboration",
      title: "Develop a business that runs smoothly on it's own",
      description:
        "Escape the hustle and build a business that runs on autopilot.",
    },
    {
      imageWebp: "/images/virtual/content-creation.webp",
      imageFallback: "/images/virtual/content-creation.jpg",
      alt: "Work life balance",
      title: "​Unlock extra time for what drives results​",
      description:
        "Our skilled VAs lighten your workload, giving you space to focus on what moves the needle.",
      isFlipped: true, 
    },
    {
      imageWebp: "/images/virtual/administrative-support.webp",
      imageFallback: "/images/virtual/administrative-support.jpg",
      alt: "Remote work setup",
      title: "​Grow revenue without the stress​",
      description:
        "Let our dedicated support manage the day-to-day so you can expand.",
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
           Stop struggling with the
            pieces you&apos;re missing. <span className="text-yellow-400">Let Ready Set VAs bring your business
            vision together.</span>
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
            calendarUrl="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true"
          />
        </div>
      </div>

      {/* Bottom Section with Scale Message and Images */}
      <div className="space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-semibold">
            <span className="text-yellowd-500">Take your business </span>
            to the next level!
          </h2>
          <p className="text-xl">
            Supercharge your success with tools, workflows, and expert help so
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