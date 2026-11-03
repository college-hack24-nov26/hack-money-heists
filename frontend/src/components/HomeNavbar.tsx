import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { ArthiqLogo } from './ArthiqLogo';
import { Button } from './ui/button';

interface HomeNavbarProps {
  onLaunchDashboard: () => void;
  onLoginClick?: () => void;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({
  onLaunchDashboard,
  onLoginClick = onLaunchDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Platform', href: '#platform' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Features', href: '#features' },
    { name: 'Intelligence', href: '#intelligence' },
    { name: 'Resources', href: '#resources' },
  ];

  const handleLinkClick = (name: string, href: string) => {
    setActiveLink(name);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-[#E5E5EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
        {/* LEFT: Prominent ARTHIQ Logo & Brand Name */}
        <div className="flex items-center">
          <ArthiqLogo
            onClick={() => handleLinkClick('Home', '#home')}
            size="default"
            theme="light"
          />
        </div>

        {/* CENTER: Horizontal Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 bg-[#F7F7FA] px-3 py-1.5 rounded-full border border-[#E5E5EB]">
          {navLinks.map((link) => {
            const isActive = activeLink === link.name;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.name, link.href);
                }}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-black font-extrabold bg-white shadow-xs'
                    : 'text-black hover:text-[#6D45CF] hover:bg-white/60'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* RIGHT: Login & Get Started Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onLoginClick}
            className="text-sm font-bold text-black hover:text-[#6D45CF] px-4"
          >
            Login
          </Button>

          <Button
            variant="default"
            onClick={onLaunchDashboard}
            className="text-sm font-bold h-11 px-6 bg-[#6D45CF] hover:bg-[#5B37B5] text-white shadow-[0_4px_14px_rgba(109,69,207,0.25)] flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-[#E5E5EB] text-black hover:bg-[#F7F7FA] focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#E5E5EB] bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E5E5EB]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.name, link.href);
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-black hover:bg-[#F7F7FA] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="w-full text-sm font-semibold"
            >
              Login
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchDashboard();
              }}
              className="w-full text-sm font-semibold bg-[#6D45CF] hover:bg-[#5B37B5] text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

