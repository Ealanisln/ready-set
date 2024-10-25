import BayAreaMap from '@/components/About/Bay Area map/BayAreaMap';
import { Contact } from 'lucide-react';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <BayAreaMap />
      <Contact />
    </div>
  );
}