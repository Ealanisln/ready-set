// src/app/(site)/food/page.tsx
import { Metadata } from 'next';
import { FormType } from '@/components/Logistics/QuoteRequest/types';
import { FormManager } from '@/components/Logistics/QuoteRequest/Quotes/FormManager';
import CateringDelivery from '@/components/FoodDelivery/CateringDelivery';
import DeliveryPartners from '@/components/FoodDelivery/DeliveryPartners';
import FoodIcons from '@/components/FoodDelivery/FoodIcons';
import DeliveryTerms from '@/components/FoodDelivery/DeliveryTerms';
import HostingChecklist from '@/components/FoodDelivery/HostingChecklist';
import MainMeal from '@/components/FoodDelivery/MainMeal';

export const metadata: Metadata = {
  title: 'Food Delivery Services for Events | Ready Set', // Replace with your title
  description:
    'We offer reliable and efficient catering delivery services for your events. Delicious food delivered right to your door in Bay Area and Sillicon Valley!', // Replace with your description
  keywords: [
    'food delivery',
    'catering delivery',
    'event food',
    'catering service',
    'banquet delivery',
    // Add more relevant keywords for your service and location
  ],
  openGraph: {
    title: 'Exceptional Catering and Food Delivery Services | Ready Set', // Replace with your Open Graph title
    description:
      'Make your event a success with our high-quality food delivery. Serving [Service Areas] and ensuring a memorable culinary experience.', // Replace with your Open Graph description
    type: 'website',
    locale: 'en_US', // Set the language to English (United States)
    siteName: 'Ready Set', // Replace with your site name
    // You can add a relevant image for Open Graph
    // images: [
    //   {
    //     url: 'Your image URL',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Image description',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image', // Or 'summary' if you don't have a large image
    title: 'Your Brand: Hassle-Free Food Delivery for Events', // Replace with your Twitter title
    description:
      'Need delicious food for your next event? We handle the delivery in Bay Area and Sillicon Valley! Contact us today.', // Replace with your Twitter description
    // You can add Twitter handles if you have them
    // site: '@YourTwitter',
    // creator: '@YourTwitter',
    // You can add a relevant image for Twitter Card
    // images: ['Your Twitter image URL'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // You can add more metadata as needed, such as 'authors', 'category', 'alternates', etc.
};

export default function FoodPage() {
  return (
    <div className="pt-20 md:pt-24">
      <CateringDelivery />
      <DeliveryPartners />
      <FoodIcons />
      <DeliveryTerms />
      <HostingChecklist />
      <MainMeal />
    </div>
  );
}
