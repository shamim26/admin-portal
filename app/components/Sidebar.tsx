"use client";
import {
  HomeIcon,
  ListOrderedIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
  ImageIcon,
  MenuIcon,
  LogOutIcon,
} from "lucide-react";
import Brand from "./Brand";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div>
      <div className="flex flex-col h-screen w-60 px-3 overflow-y-auto bg-white">
        <div className="my-4">
          <Brand />
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <div
                className={`flex items-center justify-start gap-1 px-8 py-2 rounded-md ${
                  item.href === pathname ? "bg-primary text-white" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </div>
            </Link>
          ))}
        </div>
        <div className=" mt-auto mb-4">
          <button className="flex items-center  gap-1 px-8 py-2 text-red-500">
            <LogOutIcon size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: <HomeIcon size={20} />,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: <MenuIcon size={20} />,
  },
  {
    label: "Products",
    href: "/products",
    icon: <PackageIcon size={20} />,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: <ListOrderedIcon size={20} />,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: <UsersIcon size={20} />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsIcon size={20} />,
  },
  {
    label: "Banners",
    href: "/banners",
    icon: <ImageIcon size={20} />,
  },
];
