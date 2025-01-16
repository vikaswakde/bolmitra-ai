import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="transition-colors duration-200 text-gray-600 hover:text-purple-500"
    >
      {children}
    </Link>
  );
};

const Header = () => {
  return (
    <nav className="container flex items-center justify-between px-8 py-4 mx-auto base ">
      <div className="flex lg:flex-1">
        <NavLink href="/">
          <span className="flex items-center gap-2 shrink-0 pt-1">
            <Image
              src="/bolMitra.png"
              alt="bolMitra Logo"
              width={52}
              height={52}
              className="hover:rotate-12 transform transition duration-200 ease-in-out"
            />
            <span className="font-extrabold text-lg pb-2 -ml-3 pt-2">
              BolMitra
            </span>
          </span>
        </NavLink>
      </div>
      <div className="hidden md:flex lg:justify-center  gap-4 lg:gap-12 lg:items-center">
        <Button
          variant="outline"
          className="border rounded-2xl border-gray-200 shadow-inner"
        >
          <NavLink href="/#pricing">Pricing</NavLink>
        </Button>
        <span className="border"></span>
        <NavLink href="/feedback">
          <Button
            variant="outline"
            className="border-gray-200 shadow-inner rounded-2xl"
          >
            Feedback 4u
          </Button>
        </NavLink>
      </div>
      <div className="flex lg:justify-end lg:flex-1 gap-2">
        <SignedIn>
          <div className="flex gap-4 items-center">
            <Button variant="outline" className="rounded-2xl shadow-inner">
              <NavLink href="/dashboard">Start Practice</NavLink>
            </Button>
            {/* Profile */}
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <NavLink href="/sign-in">Sign In</NavLink>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Header;
