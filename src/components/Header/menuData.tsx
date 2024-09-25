import { Menu } from "@/types/menu";

export const cateringRequestMenuItem: Menu = {
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
      id: 10,  // Changed from 9 to avoid duplicate IDs
      title: "Order status",
      path: "/order-status",
      newTab: false,
    },
  ]
};

export const adminMenuItem: Menu = {
  id: 6,
  title: "Admin",
  path: "/admin",
  newTab: false,
};

export const vendorMenuItem: Menu = {
  id: 7,
  title: "Vendor",
  path: "/vendor",
  newTab: false,
};

export const driverMenuItem: Menu = {
  id: 8,
  title: "Driver",
  path: "/driver",
  newTab: false,
};

const menuData: Menu[] = [
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
];

export default menuData;