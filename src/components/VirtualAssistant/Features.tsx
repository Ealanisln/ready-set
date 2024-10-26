import React from 'react';
import { CalendarDays } from 'lucide-react';

const EducationLanding = () => {
  const events = [
    {
      date: '2 December 2024',
      title: 'Sed ut perspiciatis unde omnis iste',
      time: '10:00 Am - 3:00 Pm',
      location: 'Rc Auditorium'
    },
    {
      date: '2 December 2024',
      title: 'Lorem ipsum gravida nibh vel',
      time: '10:00 Am - 3:00 Pm',
      location: 'Rc Auditorium'
    },
    {
      date: '2 December 2024',
      title: 'Morbi accumsan ipsum velit',
      time: '10:00 Am - 3:00 Pm',
      location: 'Rc Auditorium'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 mb-16">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Welcome to</h1>
          <h2 className="text-4xl font-bold">Write My Disso</h2>
          <p className="text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry&apos;s standard dummy text ever since the
            1500s, when an unknown printer took a galley of type and scrambled it to
            make a type specimen book.
          </p>
          <button className="bg-yellow-400 px-6 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors">
            READ MORE
          </button>
        </div>

        {/* Right Column - Upcoming Events */}
        <div className="bg-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">UPCOMING EVENTS</h3>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="bg-yellow-300 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <CalendarDays size={16} />
                  {event.date}
                </div>
                <h4 className="font-semibold mb-1">{event.title}</h4>
                <div className="text-sm">
                  {event.time} • {event.location}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>      
    </div>
  );
};

export default EducationLanding;