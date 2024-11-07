import Image from "next/image";
import Link from "next/link";
import AppointmentDialog from "./Appointment";

const BusinessScaleSection = () => {
  const benefits = [
    {
      imageWebp: "/images/virtual/administrative-support.webp",
      imageFallback: "/images/virtual/administrative-support.jpg",
      alt: "Business collaboration",
      title: "Build a business that runs without you",
      description:
        "Streamline your processes and automate tasks, instead of doing everything manually.",
    },
    {
      imageWebp: "/images/virtual/content-creation.webp",
      imageFallback: "/images/virtual/content-creation.jpg",
      alt: "Work life balance",
      title: "Enjoy more free time",
      description:
        "Imagine saving 20 hours a week and doing more of what you love just by having the right virtual assistant, tech and processes.",
    },
    {
      imageWebp: "/images/virtual/customer-service.webp",
      imageFallback: "/images/virtual/customer-service.jpg",
      alt: "Remote work setup",
      title: "Make more money with less stress",
      description:
        "With the right scaling techniques, you'll be able to take on more clients, create better offers, and expand your market.",
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
            <span className="text-yellowd-500">Are you trapped</span> in a business that demands your constant attention?
          </h2>

          <div className="space-y-4">
            <p className="text-lg">
            We’ve been there: You can’t take a day off without your entire operation grinding to a halt. 
            Every decision, every task, relies on you. You are exhausted!.{" "}
            </p>

            <p className="text-lg">
            <strong> You’ve probably considered hiring a virtual assistant to lighten the load. </strong> 
            <p> But let’s face it, simply delegating tasks won’t solve the root problems holding your business back. 
              Without clear systems and processes in place, the bottleneck remains, you’ll still be burdened by decisions 
              and unable to truly leverage the support of a VA. </p>
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
            <span className="text-yellowd-500">Scale your business</span> the
            right way.
          </h2>
          <p className="text-xl">
            With the right{" "}
            <strong>technology, processes and virtual assistants</strong>, you
            can:
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
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                </picture>
              </div>
              <div className="mt-6 flex flex-col items-center space-y-4 px-4">
                <h3 className="text-center text-2xl font-bold">{benefit.title}</h3>
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