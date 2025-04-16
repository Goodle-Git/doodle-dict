import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { CustomButton } from '../ui/custom-button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setIsMenuOpen(false);
    }
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white border-b-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold font-space-grotesk"
          >
            <div className="w-10 h-10 rounded-md bg-doodle-yellow border-2 border-black flex items-center justify-center">
              
              <img src="/DoodleDict.png" alt="" />
            </div>
            <span className="hidden sm:inline-block">
              <div className='w-40 h-10'>

              <img src="/DoodleDict-Secondary.png" alt="" />
              </div>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-space-grotesk">
            <a href="#home" onClick={(e) => scrollToSection('home', e)} className="font-bold hover:text-doodle-coral transition-colors">Home</a>
            <a href="#features" onClick={(e) => scrollToSection('features', e)} className="font-bold hover:text-doodle-coral transition-colors">Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection('how-it-works', e)} className="font-bold hover:text-doodle-coral transition-colors">How It Works</a>
            <a href="#pricing" onClick={(e) => scrollToSection('pricing', e)} className="font-bold hover:text-doodle-coral transition-colors">Pricing</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <CustomButton 
                  size="sm"
                  variant='primary'
                  >Dashboard</CustomButton>
                </Link>
                
              </>
            ) : (
              <>
                <Link to="/login">
                  <CustomButton variant="outline" size="sm">Log in</CustomButton>
                </Link>
                <Link to="/signup">
                  <CustomButton size="sm">Sign up free</CustomButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md border-2 border-black bg-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 border-l-2 border-black ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col p-8 space-y-8 h-full font-space-grotesk">
            <div className="flex justify-between items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-2xl font-bold"
              >
                <div className="w-10 h-10 rounded-md bg-doodle-yellow border-2 border-black flex items-center justify-center">
                  <span className="text-black text-lg">D</span>
                </div>
                <span>DoodleDict</span>
              </Link>
              <button
                className="p-2 rounded-md border-2 border-black bg-white focus:outline-none"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-6 text-lg">
              <a 
                href="#home" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors"
                onClick={(e) => scrollToSection('home', e)}
              >
                Home
              </a>
              <a 
                href="#features" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors"
                onClick={(e) => scrollToSection('features', e)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors"
                onClick={(e) => scrollToSection('how-it-works', e)}
              >
                How It Works
              </a>
              <a 
                href="#pricing" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors"
                onClick={(e) => scrollToSection('pricing', e)}
              >
                Pricing
              </a>
              <Link 
                to="/dashboard" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors flex items-center gap-2"
                onClick={toggleMenu}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            </div>
            
            <div className="mt-auto space-y-4">
              <CustomButton variant="outline" className="w-full">Log in</CustomButton>
              <CustomButton className="w-full">Sign up free</CustomButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
