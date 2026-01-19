import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import React, { useMemo } from "react";
import { signOut } from "@/lib/auth-client";
import { useSessionStore } from "@/stores/session-store";

export default function MobileMenu() {
    const { user } = useSessionStore();
    const router = useRouter();
    const navData = useMemo(() => [
        {displayName: "Home", path: "/"},
        {displayName: "About", path: "/about"},
        {displayName: "Pricing", path: "/pricing"},
        {displayName: "Chat", path: "/chat"},
    ], []);
    return (
        <React.Fragment>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {/* <Button variant="outline">Actions</Button> */}
                    <span
                        className="cursor-pointer rounded-sm px-[2px]"
                        aria-label="Open menu"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Menu size={24} />
                    </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40" align="end">
                    {/* <DropdownMenuLabel>History Actions</DropdownMenuLabel> */}

                    <DropdownMenuGroup>
                        {navData.map((navItem) => (
                             <DropdownMenuItem key={navItem.displayName} className="cursor-pointer">
                                <Link
                                    to={navItem.path}
                                    className="text-[#7b7b7b] rounded-sm font-medium [&.active]:text-white [&.active]:font-semibold "
                                >
                                    {navItem.displayName}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        
                            {user && user?.id ? (
                                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                                    Sign Out
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.navigate({ to: '/signin', search: { isGuestModePreview: undefined }})
                                    }} 
                                    className="cursor-pointer"
                                >
                                    <Link
                                        to="/signin"
                                        search={{ isGuestModePreview: undefined }}
                                        className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold"
                                    >
                                        Sign in
                                    
                                    </Link>
                                </DropdownMenuItem>
                            )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </React.Fragment>
    )
}


                  