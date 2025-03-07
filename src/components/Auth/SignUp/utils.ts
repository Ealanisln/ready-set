import { UserType } from "./FormSchemas";

export const getBottomText = (type: UserType) => {
  switch (type) {
    case "vendor":
      return "If you need us to deliver for you to your client";
    case "client":
      return "If you want to order from our vendors";
    default:
      return "";
  }
};