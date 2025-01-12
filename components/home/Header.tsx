import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
    <nav className="container flex items-center justify-between px-8 py-4 mx-auto base">
      <div className="flex lg:flex-1">
        <NavLink href="/">
          <span className="flex items-center gap-2 shrink-0 pt-1">
            <Image
              src="/LipiMitra.png"
              alt="LipiMitra Logo"
              width={52}
              height={52}
              className="hover:rotate-12 transform transition duration-200 ease-in-out"
            />
            <span className="font-extrabold text-lg pb-2 -ml-1">LipiMitra</span>
          </span>
        </NavLink>
      </div>
      <div className="flex lg:justify-center  gap-4 lg:gap-12 lg:items-center">
        <NavLink href="/#pricing">Pricing</NavLink>
        <span className="border"></span>
        <NavLink href="/#posts">Your Posts</NavLink>
      </div>
      <div className="flex lg:justify-end lg:flex-1 gap-2">
        <SignedIn>
          <div className="flex gap-4 items-center">
            <NavLink href="/dashboard">Start Practice</NavLink>
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
