// Fake Users for Testing

const fakeUsers = {
    vendor: {
      userType: "vendor",
      contact_name: "Alice Johnson",
      email: "alice@foodtruck.com",
      phoneNumber: "(555) 123-4567",
      password: "P@ssw0rd123!",
      website: "https://alicesfoodtruck.com",
      street1: "123 Main St",
      street2: "Unit 4B",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      parking: "Street parking available",
      countiesServed: ["Los Angeles", "Orange"],
      timeNeeded: ["Lunch", "Dinner"],
      cateringBrokerage: ["Weddings", "Corporate Events"],
      frequency: "Weekly",
      provisions: ["Entrees", "Desserts"],
      company: "Alice's Food Truck"
    },
    
    client: {
      userType: "client",
      email: "bob@techcorp.com",
      website: "https://techcorp.com",
      phoneNumber: "(555) 987-6543",
      password: "C0rp0rate$ecure",
      contact_name: "Bob Smith",
      company: "TechCorp Inc.",
      street1: "456 Innovation Ave",
      street2: "Floor 12",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      parking: "Parking garage on-site",
      countiesServed: ["San Francisco", "San Mateo"],
      timeNeeded: ["Lunch", "Breakfast"],
      frequency: "Daily",
      head_count: "50-100"
    },
    
    driver: {
      userType: "driver",
      name: "Charlie Brown",
      email: "charlie@drivers.com",
      phoneNumber: "(555) 246-8135",
      password: "Dr!ver2024$",
      street1: "789 Delivery Lane",
      street2: "Apt 3C",
      city: "San Diego",
      state: "CA",
      zip: "92101"
    },
    
    helpdesk: {
      userType: "helpdesk",
      name: "Diana Garcia",
      email: "diana@support.com",
      phoneNumber: "(555) 369-2580",
      password: "H3lpD3sk2024!",
      street1: "101 Support Street",
      street2: "",
      city: "Sacramento",
      state: "CA",
      zip: "95814"
    }
  };
  
  export default fakeUsers;