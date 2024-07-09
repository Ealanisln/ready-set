export const COUNTIES = [
  "San Francisco", "San Mateo", "Contra Costa", "Alameda",
  "Santa Clara", "Santa Cruz", "Marin", "Solano"
] as const;

export const TIME_NEEDED = ["Breakfast", "Lunch", "Dinner"] as const;

export const CATERING_BROKERAGE = [
  "Foodee", "Ez Cater", "Grubhub", "Cater Cow",
  "Zero Cater", "Platterz", "Direct Delivery", "Other"
] as const;

export const FREQUENCY = [
  "1-5 per week", "6-15 per week", "16-25 per week", "over 25 per week"
] as const;

export const PROVISIONS = [
  "Napkins", "Labels", "Utensils", "Serving Utensils", "Place Settings"
] as const;

export const HEADCOUNT = [
  "1-24", "25-49", "50-74", "75-99", "100-124", "125-149",
  "150-174", "175-199", "200-249", "250-299", "300+"
] as const;