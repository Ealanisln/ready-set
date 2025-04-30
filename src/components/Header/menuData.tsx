import { MenuItem } from "@/types/menu";

// Role-based menu items
export const adminMenuItem: MenuItem = {
  id: 30,
  title: "Admin Dashboard",
  path: "/app/(site)/(users)/admin",
  newTab: false,
};

export const superAdminMenuItem: MenuItem = {
  id: 31,
  title: "Super Admin Dashboard",
  path: "/app/(site)/(users)/admin",
  newTab: false,
};

export const driverMenuItem: MenuItem = {
  id: 32,
  title: "Driver Dashboard",
  path: "/app/(site)/(users)/driver",
  newTab: false,
};

export const helpdeskMenuItem: MenuItem = {
  id: 33,
  title: "Helpdesk Portal",
  path: "/app/(site)/(users)/helpdesk",
  newTab: false,
};

export const vendorMenuItem: MenuItem = {
  id: 34,
  title: "Vendor Portal",
  path: "/app/(site)/(users)/vendor",
  newTab: false,
};

export const clientMenuItem: MenuItem = {
  id: 35,
  title: "Client Dashboard",
  path: "/app/(site)/(users)/client",
  newTab: false,
};

export const cateringRequestMenuItem: MenuItem = {
  id: 20,
  title: "Orders",
  newTab: false,
  submenu: [
    {
      id: 21,
      title: "Catering Request",
      path: "/catering-request",
      newTab: false,
    },
    {
      id: 22,
      title: "On-demand",
      path: "/on-demand",
      newTab: false,
    },
    {
      id: 23,
      title: "Order status",
      path: "/order-status",
      newTab: false,
    },
  ],
};

export const rsSubsidiariesMenuItem: MenuItem = {
  id: 11,
  title: "RS Subsidiaries",
  newTab: false,
  submenu: [
    {
      id: 15,
      title: "Logistics",
      path: "/logistics",
      newTab: false,
    },
    {
      id: 16,
      title: "Virtual Assistant",
      path: "/va",
      newTab: false,
    },
    {
      id: 17,
      title: "Join Us",
      path: "/apply",
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
    title: "Resources",
    path: "/free-resources",
    newTab: false,
  },
  {
    id: 7,
    title: "Sign In",
    path: "/sign-in",
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