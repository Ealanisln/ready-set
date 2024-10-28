import React from "react";
import { CalendarDays } from "lucide-react";

const EducationLanding = () => {
  const events = [
    {
      date: "2 December 2024",
      title: "Sed ut perspiciatis unde omnis iste",
      time: "10:00 Am - 3:00 Pm",
      location: "Rc Auditorium",
    },
    {
      date: "2 December 2024",
      title: "Lorem ipsum gravida nibh vel",
      time: "10:00 Am - 3:00 Pm",
      location: "Rc Auditorium",
    },
    {
      date: "2 December 2024",
      title: "Morbi accumsan ipsum velit",
      time: "10:00 Am - 3:00 Pm",
      location: "Rc Auditorium",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Welcome Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome to</h1>
            <h2 className="text-4xl font-bold">Write My Disso</h2>
          </div>
          <p className="text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <button className="rounded-lg bg-yellow-400 px-8 py-2 font-semibold transition-colors hover:bg-yellow-500">
            READ MORE
          </button>
        </div>

        {/* Right Column - Events Section */}
        <div className="rounded-2xl bg-yellow-400 p-8 shadow-lg">
          <h3 className="mb-6 text-2xl font-bold tracking-tight">UPCOMING EVENTS</h3>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="rounded-xl bg-yellow-300/50 p-6 transition-all hover:bg-yellow-300/60"
              >
                <div className="mb-2 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-base">{event.date}</span>
                </div>
                <h4 className="mb-3 text-xl font-bold">{event.title}</h4>
                <p className="text-gray-700">
                  {event.time} • {event.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationLanding;