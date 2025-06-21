"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { BellIcon, ChevronDownIcon, MenuIcon, SearchIcon } from "lucide-react";

export default function Navbar() {
  return (
    <div className="bg-white flex items-center justify-between px-5 py-5 shadow">
      <div className=" relative flex items-center gap-2">
        <MenuIcon size={25} className="mr-5" />
        <Input type="text" placeholder="Search" className="w-2xs" />
        <SearchIcon
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BellIcon size={22} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <p>Notifications</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            English <ChevronDownIcon size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* account */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500 text-left">Admin</p>
              </div>
              <ChevronDownIcon
                size={18}
                className=" border border-gray-300 rounded-full"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <p>Profile</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
