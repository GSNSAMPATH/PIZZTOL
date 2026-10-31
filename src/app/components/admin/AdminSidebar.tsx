"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  BarChart3,
  Bell,
  Box,
  ChartNoAxesCombined,
  ChevronRight,
  CreditCard,
  Grid2X2,
  Package,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  UserCircle,
} from "lucide-react";


const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: Grid2X2,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Box,
    expandable: true,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  // {
  //   label: "Notifications",
  //   href: "/admin/notifications",
  //   icon: Bell,
  // },
  // {
  //   label: "Analytics",
  //   href: "/admin/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   label: "Settings",
  //   href: "/admin/settings",
  //   icon: SlidersHorizontal,
  // },
  // {
  //   label: "Account",
  //   href: "/admin/account",
  //   icon: UserCircle,
  // },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[262px] bg-black lg:block">
      {/* Logo */}
      <div className="flex h-[96px] items-center px-7">
        <Link
          href="/admin"
          className="flex items-center gap-2"
        >
          <Image
            src="/PIZZTOL (1).png"
            alt="Logo"
            width={1080}
            height={1080}
            className="h-auto w-30"
          />

          <span className="mt-1 text-[12px] font-semibold text-white">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-7 pt-4">
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex h-[44px] items-center gap-4  px-4 text-[13px] font-medium transition-all",
                  active
                    ? "bg-red-700 text-white"
                    : "text-white hover:bg-[#f3f3f3] hover:text-black",
                ].join(" ")}
              >
                <Icon
                  size={17}
                  strokeWidth={2}
                />

                <span className="flex-1">
                  {item.label}
                </span>

                {item.expandable && (
                  <ChevronRight
                    size={16}
                    strokeWidth={2}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}