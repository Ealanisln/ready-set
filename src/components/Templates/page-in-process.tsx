// app/in-process/page.jsx
import Breadcrumb from "@/components/Common/Breadcrumb";

const InProcessPage = () => {
  return (
    <div className="container mx-auto py-8">
      
    

      {/* Page Content */}
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold mb-4">This Page is in Process</h1>
        <p className="text-lg text-gray-600">
          We are working hard to get this page ready. Stay tuned for updates!
        </p>
        {/* Optional placeholder illustration or icon */}
        <div className="mt-8">
          <img
            src="/images/in-process-placeholder.svg" // Replace with your actual placeholder image path
            alt="In Process Illustration"
            className="mx-auto w-64"
          />
        </div>
      </div>
    </div>
  );
};

export default InProcessPage;

