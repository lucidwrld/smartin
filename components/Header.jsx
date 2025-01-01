import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { logoMain, logoMain1, logoMain2 } from "@/public/images";

const Header = ({ isLandingPage = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100;
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Try it", href: isLandingPage ? "#try-it" : "/#try-it" },
    { label: "Features", href: isLandingPage ? "#features" : "/#features" },
    { label: "Demo", href: isLandingPage ? "#demo" : "/#demo" },
    {
      label: "Testimonials",
      href: isLandingPage ? "#testimonials" : "/#testimonials",
    },
  ];

  const isActive = (href) => {
    const section = href.split("#")[1];
    return activeSection === section;
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-brandPurple h-[35px]"
          >
            <img
              src={logoMain1.src}
              alt=""
              className="h-full w-auto object-contain"
            />
          </Link>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "text-brandPurple"
                    : "text-brandBlack hover:text-brandPurple"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="text-brandPurple hover:text-backgroundPurple"
            >
              Login
            </Link>
            <Link
              href="/auth/create-account"
              className="bg-brandPurple text-white px-4 py-2 rounded-lg hover:bg-backgroundPurple"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 bg-white">
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "text-brandPurple"
                    : "text-brandBlack hover:text-brandPurple"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="text-brandPurple hover:text-backgroundPurple"
            >
              Login
            </Link>
            <Link
              href="/auth/create-account"
              className="bg-brandPurple text-white px-4 py-2 rounded-lg hover:bg-backgroundPurple text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export { Header };
