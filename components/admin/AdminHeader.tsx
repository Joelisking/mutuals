
"use client";

import { User } from "lucide-react";
import { useDispatch, useSelector } from "@/lib/redux/store";
import { authActions, selectUser } from "@/lib/redux/slices/auth";
import { MUTUALS_COOKIE_ID } from "@/lib/constants";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminHeader() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    // Clear the auth cookie so Next.js middleware stops allowing access
    document.cookie = `${MUTUALS_COOKIE_ID}=; path=/; max-age=0; SameSite=Strict`;
    dispatch(authActions.logout());
    router.push("/admin/login");
  };

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b border-white/10 bg-zinc-950/50 px-6 backdrop-blur-xl">
      <div className="w-full flex-1">
        {/* Placeholder for search or breadcrumbs */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profilePictureUrl} alt={user?.firstName} />
              <AvatarFallback>{user?.firstName?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Settings</DropdownMenuItem>
          <DropdownMenuItem disabled>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
