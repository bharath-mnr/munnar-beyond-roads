//src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MenuIcon, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { navLinks, whatsappLink } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-border/60 bg-background/95 py-2.5 shadow-sm"
          : "bg-transparent py-4",
      )}
    >
      <div className="container-page flex items-center justify-between gap-4">
        <Link to="/" aria-label="Munnar Beyond Roads — home" className="shrink-0">
          <Logo light={!scrolled} />
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  scrolled
                    ? "text-foreground/75 hover:text-foreground"
                    : "text-white/85 hover:text-white",
                  isActive &&
                    (scrolled
                      ? "text-primary after:bg-accent"
                      : "text-white after:bg-accent"),
                  isActive &&
                    "after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              <MessageCircle /> Book on WhatsApp
            </a>
          </Button>

          {/* mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant={scrolled ? "outline" : "glass"}
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="pb-0">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {navLinks.map((l) => (
                  <SheetClose asChild key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "rounded-xl px-4 py-3.5 font-display text-2xl font-semibold transition-colors hover:bg-secondary",
                          isActive ? "bg-secondary text-primary" : "text-foreground/80",
                        )
                      }
                    >
                      {l.label}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto p-6">
                <Button asChild variant="accent" size="lg" className="w-full">
                  <a href={whatsappLink()} target="_blank" rel="noreferrer">
                    <MessageCircle /> Book on WhatsApp
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
