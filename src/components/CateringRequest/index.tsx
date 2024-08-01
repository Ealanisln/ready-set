import CateringRequestForm from "./CateringFormRequest";
import SectionTitle from "../Common/SectionTitle";


const CateringRequest = () => {
  return (
    <section
      id="catering-request"
      className="bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="Catering request"
            title="8-Point Checklist"
            paragraph="We follow an 8-point checklist to minimize errors and ensure an on-time delivery set up.
"
            center
          />
        </div>

        <div className="flex flex-col items-center space-y-8">
          <CateringRequestForm />
        </div>
      </div>
    </section>
  );
};

export default CateringRequest;
