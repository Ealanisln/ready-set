// pages/system-architecture.tsx
import SystemArchitectureViewer from '@/components/VirtualAssistant/SystemArchitectureViewer';

export default function SystemArchitecturePage() {
  return (
    <div className='pt-32'>
      <h1 className="text-3xl font-bold mb-6 text-center">System Architecture for VA</h1>
      <SystemArchitectureViewer />
    </div>
  );
}