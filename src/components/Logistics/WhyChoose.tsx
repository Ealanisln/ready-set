import { Check } from "lucide-react"

const WhyChoose = () => {
  return (
    <>
      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              Why Choose Ready Set?
            </h2>
            <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
              Ready Set offers a complete suite of logistics services that include Delivery, 
              Routing, Dispatch, & Management for the following industries: Catered Food 
              Delivery, Floral Delivery, Bakery Delivery, and Specialty Delivery.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {[
              "Specialized temperature control equipment",
              "Professional handling protocols",
              "Experienced delivery team",
              "Real-time tracking system",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg bg-white p-6 shadow-md"
              >
                <Check className="mr-4 h-6 w-6 flex-shrink-0 text-yellow-400" />
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default WhyChoose

