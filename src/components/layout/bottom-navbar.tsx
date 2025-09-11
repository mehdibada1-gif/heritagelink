"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutGrid, PlusSquare, User, LogIn } from "lucide-react";
import { useAuth, AuthLoading } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn(
        "flex flex-col items-center justify-center gap-1 text-xs transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
    )}>
        <Icon className="h-6 w-6" />
        <span>{label}</span>
    </Link>
  );
};


export function BottomNavbar() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleAuthAction = () => {
        if (user) {
            router.push('/profile');
        } else {
            router.push('/login');
        }
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <AuthLoading fallback={<div className="h-16 w-full"/>}>
                <div className="container mx-auto flex h-16 max-w-lg items-center justify-around px-4">
                    <NavLink href="/" icon={Home} label="Home" />
                    <NavLink href="/boards" icon={LayoutGrid} label="Boards" />
                    {user && <NavLink href="/submit" icon={PlusSquare} label="Share" />}
                    <button
                        onClick={handleAuthAction}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 text-xs transition-colors hover:text-primary",
                            pathname === '/profile' || pathname === '/login' ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        {user ? <User className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
                        <span>{user ? "Profile" : "Login"}</span>
                    </button>
                </div>
            </AuthLoading>
        </div>
    );
}
