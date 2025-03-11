import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export function MainNav() {
  const { user, logoutMutation } = useAuth();
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const handleNavClick = (path: string) => {
    setActiveLink(path);
    setTimeout(() => setActiveLink(null), 2000);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="relative">
            <svg
              width="160"
              height="40"
              viewBox="0 0 160 40"
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Logo SVG content */}
              <path
                d="M15 10 L45 10 M30 8 L30 35"
                stroke="url(#purpleGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M15 10 L45 10 M30 8 L30 35"
                stroke="url(#purpleGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeOpacity="0.2"
                fill="none"
              />
              <text x="55" y="25" className="font-serif text-xl">
                <tspan fill="url(#purpleGradient)">Third Way</tspan>
              </text>
              <defs>
                <linearGradient id="reflectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c4b5fd" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#c4b5fd" />
                </linearGradient>
              </defs>
              <g transform="translate(55, 26)">
                <text className="font-serif text-xl" transform="scale(1, -0.7) skewX(-5)">
                  <tspan fill="url(#reflectionGradient)">Third Way</tspan>
                </text>
              </g>
            </svg>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <nav className="flex items-center">
              <Link 
                href="/about" 
                onClick={() => handleNavClick('/about')}
                className={`nav-link mx-3 ${activeLink === '/about' ? 'active' : ''}`}
              >
                About
              </Link>
              <Link 
                href="/categories" 
                onClick={() => handleNavClick('/categories')}
                className={`nav-link mx-3 ${activeLink === '/categories' ? 'active' : ''}`}
              >
                Categories
              </Link>
            </nav>
          </div>

          <div className="flex items-center justify-between space-x-2">
            {user ? (
              <>
                <Link href="/profile">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleNavClick('/profile')}
                    className={`nav-link ${activeLink === '/profile' ? 'active' : ''}`}
                  >
                    Perfil
                  </Button>
                </Link>
                <Link href="/admin/manage-posts">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleNavClick('/admin/manage-posts')}
                    className={`nav-link ${activeLink === '/admin/manage-posts' ? 'active' : ''}`}
                  >
                    Admin
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => logoutMutation.mutate()}
                  className="nav-link"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavClick('/auth')}
                  className={`nav-link ${activeLink === '/auth' ? 'active' : ''}`}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}