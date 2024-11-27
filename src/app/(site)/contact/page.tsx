// app/contact/page.tsx
import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import BayAreaMap from "@/components/Contact/mapbayarea";
import AustinMap from "@/components/Contact/mapaustintx";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Ready Set Group LLC | Bay Area & Austin Business Solutions",
  description: "Connect with Ready Set for premier catering delivery and virtual assistant services. Serving San Francisco Bay Area and Austin, TX. Available 24/7 for your business needs.",
  keywords: [
    "contact Ready Set",
    "Bay Area logistics",
    "Austin business services",
    "catering delivery contact",
    "virtual assistant contact",
    "business solutions",
    "San Francisco services",
    "Austin TX services",
    "logistics support",
    "business inquiries",
    "service areas",
    "customer support",
    "business hours",
    "delivery zones",
    "service requests"
  ],
  openGraph: {
    title: "Contact Ready Set | Premier Business Solutions Provider",
    description: "Get in touch with Bay Area's leading logistics and virtual assistant service provider. Serving San Francisco Bay Area and Austin, TX.",
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Group LLC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Ready Set | Business Solutions Provider",
    description: "Connect with Ready Set for premium catering delivery and virtual assistant services in Bay Area and Austin.",
  },
};

const ContactPage = () => {
  return (
    <>
      {/* Hidden SEO content */}
      <div className="sr-only" role="complementary" aria-label="Contact Information">
        <h1>Contact Ready Set Group LLC - Your Business Solutions Partner</h1>
        <p>Ready Set Group LLC provides premium business solutions across the San Francisco Bay Area and Austin, Texas. Our dedicated team is available to assist with all your logistics and virtual assistant needs.</p>
        
        <div role="contentinfo" aria-label="Service Areas">
          <h2>Service Coverage</h2>
          <div>
            <h3>San Francisco Bay Area</h3>
            <ul>
              <li>San Francisco</li>
              <li>Palo Alto</li>
              <li>Mountain View</li>
              <li>San Jose</li>
              <li>Oakland</li>
              <li>Sunnyvale</li>
              <li>Richmond</li>
              <li>Hayward</li>
              <li>Concord</li>
              <li>San Mateo</li>
            </ul>
          </div>
          
          <div>
            <h3>Austin Metropolitan Area</h3>
            <ul>
              <li>Downtown Austin</li>
              <li>North Austin</li>
              <li>South Austin</li>
              <li>East Austin</li>
              <li>West Austin</li>
              <li>Round Rock</li>
              <li>Cedar Park</li>
              <li>Georgetown</li>
            </ul>
          </div>
        </div>
        
        <div role="contentinfo" aria-label="Business Hours">
          <h2>Availability</h2>
          <p>Our services are available 24/7 for emergency requests. Standard business hours are Monday through Friday, 8:00 AM to 6:00 PM local time. Weekend services available by appointment.</p>
        </div>
      </div>

      <Breadcrumb pageName="Contact Page" />
      <Contact />
      <BayAreaMap />
      <AustinMap />
    </>
  );
};

export default ContactPage;