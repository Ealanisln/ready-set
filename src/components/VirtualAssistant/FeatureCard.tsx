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
          src="/images/virtual/1.webp"
          alt="Feeling trapped icon"
          width={100}
          height={100}
          className="h-18 w-18 object-contain"
        />
      ),
      title: "Drowning in the daily grind",
    },
    {
      icon: (
        <Image
          src="/images/virtual/4.webp"
          alt="Business scaling icon"
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
          src="/images/virtual/2.webp"
          alt="Can't take on more clients icon"
          width={100}
          height={100}
          className="h-18 w-18 object-contain"
        />
      ),
      title: "Work-life balance... What's that?",
    },
    {
      icon: (
        <Image
          src="/images/virtual/3.webp"
          alt="No work life balance icon"
          width={100}
          height={100}
          className="h-18 w-18 object-contain"
        />
      ),
      title: "Business stuck in a growth rut",
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

            <div className="text-gray-700">
              You&apos;re not alone. Many entrepreneurs find themselves stuck in
              this cycle. It&apos;s exhausting, and it&apos;s not sustainable.
            </div>

            <div className="text-gray-700">
              Ready for a real change? It&apos;s time to build a business that
              thrives with or without your constant involvement. Ready Set VAs help
              you create efficient workflows and empower your team, so you can
              finally step away without everything falling apart.
            </div>

            <div className="text-gray-700">
              Here&apos;s where we come in. Ready Set to the rescue! Ready when
              you are!
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
                  calendarUrl="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ26Tewp9laqwen17F4qh13UwlakRL20eQ6LOJn7ANJ4swhUdFfc4inaFMixVsMghhFzE3nlpTSx?gv=true"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Challenges Grid */}
          <div className="flex flex-col justify-start space-y-16 pt-8">
            {challenges.map((challenge, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="w-24 flex-shrink-0">{challenge.icon}</div>
                <div className="flex-1">
                  <h3 className="whitespace-normal text-xl font-bold leading-snug">
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