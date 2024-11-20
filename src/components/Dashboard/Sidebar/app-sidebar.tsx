"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  PawPrint,
  AlertCircle,
  PlusCircle,
  Dog,
  History,
  Package,
  Calendar,
  Pill,
  Syringe,
  CircleDollarSign,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";

import { NavMain } from "@/components/Dashboard/Sidebar/nav-main";
import { NavUser } from "@/components/Dashboard/Sidebar/nav-user";
import { TeamSwitcher } from "@/components/Dashboard/Sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Vet Family",
      logo: Dog,
      plan: "Administrador",
    },
  ],
  navMain: [
    {
      title: "Clientes",
      url: "/admin/clientes",
      icon: Users,
      items: [
        {
          title: "Ver todos",
          url: "/admin/clientes",
          icon: Users,
        },
        {
          title: "Agregar nuevo",
          url: "/admin/clientes/nuevo-cliente",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Mascotas",
      url: "/admin/mascotas",
      icon: PawPrint,
      items: [
        {
          title: "Ver todas",
          url: "/admin/mascotas",
          icon: PawPrint,
        },
        {
          title: "Historial Médico",
          url: "/admin/mascotas/historial",
          icon: ClipboardList,
        },
      ],
    },
    {
      title: "Inventario",
      url: "/admin/inventario",
      icon: Package,
      items: [
        {
          title: "Productos",
          url: "/admin/inventario",
          icon: Package,
        },
        {
          title: "Medicamentos",
          url: "/admin/inventario/medicamentos",
          icon: Pill,
        },
        {
          title: "Vacunas",
          url: "/admin/inventario/vacunas",
          icon: Syringe,
        },
      ],
    },
    // {
    //   title: "Agenda",
    //   url: "/admin/agenda",
    //   icon: Calendar,
    //   items: [
    //     {
    //       title: "Citas",
    //       url: "/admin/agenda/citas",
    //       icon: Calendar,
    //     },
    //     {
    //       title: "Pagos",
    //       url: "/admin/agenda/pagos",
    //       icon: CircleDollarSign,
    //     },
    //   ],
    // },
  ],
};

const AddMedicalRecordButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>((props, ref) => (
  <SidebarMenuButton
    ref={ref}
    tooltip="Agregar Historial Médico"
    className="transition-colors duration-200 hover:bg-[#47b3b6]/10 hover:text-[#47b3b6] group-data-[collapsible=icon]:justify-center"
    {...props}
  >
    <PlusCircle className="h-4 w-4" />
    <span className="group-data-[collapsible=icon]:hidden">
      Agregar Historial Médico
    </span>
  </SidebarMenuButton>
));
AddMedicalRecordButton.displayName = "AddMedicalRecordButton";

const HistoricalArchiveButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>((props, ref) => (
  <SidebarMenuButton
    ref={ref}
    asChild
    tooltip="Archivo Histórico"
    className="transition-colors duration-200 hover:bg-[#47b3b6]/10 hover:text-[#47b3b6] group-data-[collapsible=icon]:justify-center"
  >
    <Link href="/admin/archivo-historico">
      <History className="h-4 w-4" />
      <span className="group-data-[collapsible=icon]:hidden">
        Archivo Histórico
      </span>
    </Link>
  </SidebarMenuButton>
));
HistoricalArchiveButton.displayName = "HistoricalArchiveButton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-r-[#47b3b6]/20 bg-gradient-to-b from-white to-blue-50"
      {...props}
    >
      <SidebarHeader className="border-b border-[#47b3b6]/20">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="py-4">
        {/* Removemos las props que causaban el error */}
        <NavMain items={data.navMain} />
        <style jsx global>{`
          /* Estilos globales para los elementos del NavMain */
          .sidebar-menu-button {
            @apply transition-colors duration-200 hover:bg-[#47b3b6]/10 hover:text-[#47b3b6];
          }
          .sidebar-menu-button[data-active="true"] {
            @apply bg-[#47b3b6]/15 font-medium text-[#47b3b6];
          }
          .sidebar-menu {
            @apply space-y-1;
          }
        `}</style>
        <SidebarMenu className="mt-6 px-2">
          <SidebarMenuItem></SidebarMenuItem>
          <SidebarMenuItem>
            <HistoricalArchiveButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#47b3b6]/20">
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Configuración"
              className="transition-colors duration-200 hover:bg-[#47b3b6]/10 hover:text-[#47b3b6] group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/admin/configuracion">
                <Settings className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Configuración
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Reportar un problema"
              className="transition-colors duration-200 hover:bg-[#47b3b6]/10 hover:text-[#47b3b6] group-data-[collapsible=icon]:justify-center"
            >
              <Link href="mailto:emmanuel@alanis.dev">
                <AlertCircle className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Reportar un problema
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Cerrar Sesión"
              className="transition-colors duration-200 hover:bg-red-100 hover:text-red-600 group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/api/auth/logout">
                <LogOut className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Cerrar Sesión
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Removemos la prop className del NavUser */}
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail className="bg-[#47b3b6]/5" />
    </Sidebar>
  );
}
