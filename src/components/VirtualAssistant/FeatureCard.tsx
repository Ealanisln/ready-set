import React from "react";
import Image from "next/image";
import AppointmentDialog from "./Appointment";

interface Challenge {
  icon: React.ReactNode;
  title: string;
}

const BusinessOverwhelm = () => {
  const challenges: Challenge[] = [
    {
      icon: (
        <Image
          src="/images/virtual/icon1.webp"
          alt="Feeling trapped icon"
          width={100}
          height={100}
          className="h-18 w-18 object-contain"
        />
      ),
      title: "Drowning in the Daily Grind",
    },
    {
      icon: (
        <Image
          src="/images/virtual/icon2.webp"
          alt="Can't take on more clients icon"
          width={100}
          height={100}
          className="h-18 w-18 object-contain"
        />
      ),
      title: "Work-Life Balance... What's that?",
    },
    {
      icon: (
        <Image
          src="/images/virtual/icon3.webp"
          alt="No work life balance icon"
          width={100}
          height={100}
          className="h-18 w-18 object-contain"
        />
      ),
      title: "Maxed out and missing new opportunities",
    },
    {
      icon: (
        <Image
          src="/images/virtual/icon4.webp"
          alt="Business scaling icon"
          width={100}
          height={100}
          className="h-18 w-18 object-contain"
        />
      ),
      title: "Your business",
    },
  ];

  return (
    <section className="flex w-full items-center justify-center py-16">
      <div className="container max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Column */}
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Are you <span className="text-yellow-400">trapped</span> in a
              business that demands your constant attention?
            </h1>

            <div className="text-gray-700">
              We&apos;ve been there: You can&apos;t take a day off without your
              entire operation grinding to a halt. Every decision, every task,
              relies on you. You are exhausted!
            </div>

            <div className="font-bold text-gray-700">
              You&apos;ve probably considered hiring a virtual assistant to
              lighten the load.
            </div>

            <div className="text-gray-700">
              But let&apos;s face it, simply delegating tasks won&apos;t solve
              the root problems holding your business back. Without clear
              systems and processes in place, the bottleneck remains,
              you&apos;ll still be burdened by decisions and unable to truly
              leverage the support of a VA.
            </div>

            <div className="text-gray-700">
              In fact, bringing someone into a disorganized environment could
              actually amplify your stress, leaving you feeling more overwhelmed
              than ever. It&apos;s time to build a business that can thrive with
              or without your constant involvement.
            </div>

            <div className="text-gray-700">
              <span className="font-bold">
                The truth is, simply hiring a VA isn&apos;t enough.
              </span>{" "}
              You need a different approach – Empower your business to run
              smoothly, with or without you. That&apos;s where we come in. Ready
              Set to the rescue! Ready when you are!
            </div>

            <div className="rounded-lg bg-amber-300 p-6 shadow-sm">
              <div className="text-center text-gray-700">
                <span className="mb-3 block font-bold">
                  Unsure about what to delegate?
                </span>
                Answer a few questions about your to-do list and we&apos;ll help
                you identify exactly what you can hand off to an assistant.
              </div>
              <div className="mt-6 flex justify-center">
                <AppointmentDialog
                  buttonVariant="black-small"
                  calendarUrl="https://calendar.google.com/calendar/appointments/AcZssZ1jHb5jHQLYMdGkYHDE1Joqi0ADTQ_QVVx1HcA=?gv=true&embedded=true"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Challenges Grid */}
          <div className="flex flex-col justify-start space-y-16 pt-8">
            {challenges.map((challenge, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="flex-shrink-0 w-24">{challenge.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold leading-snug whitespace-normal">
                    {challenge.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessOverwhelm;