"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Link href={href} onClick={onClick} className="relative group px-4 py-2">
      <span className="relative z-10 text-gray-600 group-hover:text-purple-600 transition-colors duration-200">
        {children}
      </span>
      <span className="absolute inset-0 rounded-full bg-purple-100 opacity-0 transform scale-75 group-hover:opacity-10 group-hover:scale-100 transition-all duration-200" />
    </Link>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`${
          isHomePage
            ? `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
                isScrolled
                  ? "bg-white/70 backdrop-blur-lg shadow-md rounded-2xl transform-cpu w-fit mx-auto mt-4 animate-width"
                  : "bg-transparent w-full "
              }`
            : "relative shadow-sm w-full bg-[linear-gradient(#e9d5ff,#e9d9ff)] border-b border-cyan-300"
        }`}
      >
        <div className="container mx-auto px-4 ">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex lg:flex-1">
              <NavLink href="/">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 shrink-0"
                >
                  <Image
                    src="/bolMitra.png"
                    alt="bolMitra Logo"
                    width={52}
                    height={52}
                    className="hover:rotate-12 transform transition duration-200 ease-in-out"
                  />
                  <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    BolMitra
                  </span>
                </motion.span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 mr-8">
              <NavLink href="/#features">Features</NavLink>
              <NavLink href="/#pricing">Pricing</NavLink>
              <SignedIn></SignedIn>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <SignedIn>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="rounded-full border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                    >
                      <NavLink href="/feedback">Feedback</NavLink>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="rounded-full border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                    >
                      <NavLink href="/dashboard">Start Practice</NavLink>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="transition-transform duration-200"
                  >
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox:
                            "w-10 h-10 hover:ring-2 hover:ring-purple-300 rounded-full transition-all duration-200",
                        },
                      }}
                    />
                  </motion.div>
                </motion.div>
              </SignedIn>

              <SignedOut>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SignInButton>
                      <Button
                        variant="outline"
                        className="rounded-full hover:bg-purple-50 border-gray-400/50 border-2 shadow-inner bg-white transition-all duration-200"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SignInButton>
                      <Button className="rounded-full bg-gradient-to-r from-purple-300 to-indigo-600 hover:from-indigo-400 hover:to-purple-600 text-white transition-all duration-300">
                        Get Started
                      </Button>
                    </SignInButton>
                  </motion.div>
                </motion.div>
              </SignedOut>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full hover:bg-purple-50"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col gap-4">
                  <NavLink
                    href="/#features"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </NavLink>
                  <NavLink
                    href="/#pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </NavLink>
                  <SignedIn>
                    <NavLink
                      href="/feedback"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Feedback
                    </NavLink>
                    <NavLink
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Start Practice
                    </NavLink>
                  </SignedIn>
                  <SignedOut>
                    <div className="flex flex-col gap-2">
                      <SignInButton>
                        <Button
                          variant="ghost"
                          className="w-full rounded-full hover:bg-purple-50"
                        >
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignInButton>
                        <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white">
                          Get Started
                        </Button>
                      </SignInButton>
                    </div>
                  </SignedOut>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
