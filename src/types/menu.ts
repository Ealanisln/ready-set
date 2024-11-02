// types/menu.ts
export interface MenuItem {
  id: number;
  title: string;
  path?: string;
  newTab?: boolean;
  submenu?: MenuItem[];
}
