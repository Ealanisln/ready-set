import { MenuItem } from "@/types/menu";

export const cateringRequestMenuItem: MenuItem = {
  id: 20, // Changed from 10 to avoid conflict
  title: "Orders",
  newTab: false,
  submenu: [
    {
      id: 21, // Changed from 3 to maintain hierarchy
      title: "Catering Request",
      path: "/catering-request",
      newTab: false,
    },
    {
      id: 22, // Changed from 9 to maintain hierarchy
      title: "On-demand",
      path: "/on-demand",
      newTab: false,
    },
    {
      id: 23, // Changed from 10 to maintain hierarchy
      title: "Order status",
      path: "/order-status",
      newTab: false,
    },
  ],
};

export const adminMenuItem: MenuItem = {
  id: 30, // Changed from 6 to avoid conflict
  title: "Admin",
  path: "/admin",
  newTab: false,
};

export const vendorMenuItem: MenuItem = {
  id: 31, // Changed from 7 to avoid conflict
  title: "Vendor",
  path: "/vendor",
  newTab: false,
};

export const driverMenuItem: MenuItem = {
  id: 32, // Changed from 9 to avoid conflict
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
      id: 15, // Changed from 12 to be sequential
      title: "Logistics",
      path: "/logistics",
      newTab: false,
    },
    {
      id: 16, // Changed from 13 to be sequential
      title: "Virtual Assistant",
      path: "/va",
      newTab: false,
    },
    {
      id: 17, // Changed from 14 to be sequential
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
  rsSubsidiariesMenuItem,
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
    title: "Free Resources",
    path: "/free-resources",
    newTab: false,
  },
  {
    id: 7,
    title: "Sign In",
    path: "/signin",
    newTab: false,
  },
  {
    id: 8,
    title: "Sign Up",
    path: "/signup",
    newTab: false,
  },
];

export default menuData;