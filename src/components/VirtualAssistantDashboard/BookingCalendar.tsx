import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BookingCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [availableHours, setAvailableHours] = useState(8); // Example: 8 hours available per day

  // Generate available time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = i + 9;
    return `${hour}:00`;
  });

  // Simulate checking availability (you'll need to connect this to your backend)
  const checkAvailability = (date: Date) => {
    // Here you would typically make an API call to check availability
    // For now, we'll just update the available hours randomly
    const randomHours = Math.floor(Math.random() * 8) + 1;
    setAvailableHours(randomHours);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      checkAvailability(newDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (date && selectedTime) {
      // Here you would typically make an API call to your backend
      console.log('Booking requested for:', {
        date: date.toISOString().split('T')[0],
        time: selectedTime,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Book Virtual Assistant Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Available Hours: {availableHours}</h3>
                <p className="text-sm text-gray-500">Select your preferred time slot</p>
              </div>
              
              <Select onValueChange={handleTimeSelect} value={selectedTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleBooking}
                className="w-full"
                disabled={!selectedTime}
              >
                Book Appointment
              </Button>

              {selectedTime && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <p className="text-sm">
                    Selected booking time: {date.toLocaleDateString()} at {selectedTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;