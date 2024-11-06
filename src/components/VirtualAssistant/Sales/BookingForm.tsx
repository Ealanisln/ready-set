'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useSearchParams } from 'next/navigation';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  requirements: string;
  preferredStartDate: Date | undefined;
}

const BookingForm = () => {
  // Initialize searchParams safely
  const searchParams = useSearchParams();
  const selectedPlan = searchParams?.get('plan') ?? '';
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    requirements: '',
    preferredStartDate: undefined,
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      // Add your API call here
      
      // Example API call:
      // await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, plan: selectedPlan }),
      // });
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-40">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Booking</CardTitle>
          <CardDescription>
            {selectedPlan ? `Selected Package: ${selectedPlan}` : 'Please fill in your details below'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                name="company"
                placeholder="Your Company Ltd."
                value={formData.company}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Special Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Tell us about your specific needs..."
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label>Preferred Start Date</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full justify-start text-left font-normal"
                  disabled={isSubmitting}
                >
                  {formData.preferredStartDate
                    ? formData.preferredStartDate.toLocaleDateString()
                    : 'Select a date'}
                </Button>
                {showCalendar && (
                  <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={formData.preferredStartDate}
                      onSelect={(date) => {
                        setFormData((prev) => ({ ...prev, preferredStartDate: date || undefined }));
                        setShowCalendar(false);
                      }}
                      className="rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;