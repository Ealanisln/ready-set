import { MenuItem } from "@/types/menu";

export const cateringRequestMenuItem: MenuItem = {
  id: 10,
  title: "Orders",
  newTab: false,
  submenu: [
    {
      id: 3,
      title: "Catering Request",
      path: "/catering-request",
      newTab: false,
    },
    {
      id: 9,
      title: "On-demand",
      path: "/on-demand",
      newTab: false,
    },
    {
      id: 10,
      title: "Order status",
      path: "/order-status",
      newTab: false,
    },
  ],
};

export const adminMenuItem: MenuItem = {
  id: 6,
  title: "Admin",
  path: "/admin",
  newTab: false,
};

export const vendorMenuItem: MenuItem = {
  id: 7,
  title: "Vendor",
  path: "/vendor",
  newTab: false,
};

export const driverMenuItem: MenuItem = {
  id: 8,
  title: "Driver",
  path: "/driver",
  newTab: false,
};

export const rsSubsidiariesMenuItem: MenuItem = {
  id: 11,
  title: "RS Subsidiaries",
  newTab: false,
  submenu: [
    {
      id: 12,
      title: "Logistics",
      path: "/logistics",
      newTab: false,
    },
    {
      id: 13,
      title: "Virtual Assistant",
      path: "/va",
      newTab: false,
    },
    {
      id: 14,
      title: "Join Us",
      path: "/join-the-team",
      newTab: false,
    },
  ],
};


const menuData: MenuItem[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  rsSubsidiariesMenuItem, // Add the new Virtual Assistant menu item
  {
    id: 4,
    title: "Contact",
    path: "/contact",
    newTab: false,
  },
  {
    id: 5,
    title: "Blog",
    path: "/blog",
    newTab: false,
  },
  {
    id: 6,
    title: "Sign In",
    path: "/signin",
    newTab: false,
  },
  {
    id: 7,
    title: "Sign Up",
    path: "/signup",
    newTab: false,
  },
];

export default menuData;
