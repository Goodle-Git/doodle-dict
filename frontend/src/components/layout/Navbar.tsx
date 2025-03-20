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
              <span className="text-black text-lg">D</span>
            </div>
            <span className="hidden sm:inline-block">
              DoodleDict
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-space-grotesk">
            <Link to="/" className="font-bold hover:text-doodle-coral transition-colors">Home</Link>
            <Link to="/features" className="font-bold hover:text-doodle-coral transition-colors">Features</Link>
            <Link to="/how-it-works" className="font-bold hover:text-doodle-coral transition-colors">How It Works</Link>
            <Link to="/pricing" className="font-bold hover:text-doodle-coral transition-colors">Pricing</Link>
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
              <Link 
                to="/" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors"
                onClick={toggleMenu}
              >
                Features
              </Link>
              <Link 
                to="/how-it-works" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors"
                onClick={toggleMenu}
              >
                How It Works
              </Link>
              <Link 
                to="/pricing" 
                className="py-2 border-b-2 border-black font-bold hover:text-doodle-coral transition-colors"
                onClick={toggleMenu}
              >
                Pricing
              </Link>
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
