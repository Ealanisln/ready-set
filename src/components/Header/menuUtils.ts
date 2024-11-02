// menuUtils.ts
import menuData, {
  cateringRequestMenuItem,
  adminMenuItem,
  vendorMenuItem,
  driverMenuItem,
} from "./menuData";
import { MenuItem } from "@/types/menu";

type UserType =
  | "client"
  | "admin"
  | "super_admin"
  | "vendor"
  | "driver"
  | undefined;

export const getUpdatedMenuData = (userType: UserType): MenuItem[] => {
  const baseMenuData = menuData.filter(
    (item) => item.title !== "Sign In" && item.title !== "Sign Up",
  );

  const additionalMenuItems: Record<NonNullable<UserType>, MenuItem[]> = {
    client: [cateringRequestMenuItem],
    admin: [adminMenuItem],
    super_admin: [adminMenuItem],
    vendor: [vendorMenuItem],
    driver: [driverMenuItem],
  };

  return [
    ...baseMenuData,
    ...(userType ? additionalMenuItems[userType] || [] : []),
  ];
};
