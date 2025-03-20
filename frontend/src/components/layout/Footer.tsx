
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t-2 border-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold font-display mb-4"
            >
              <div className="w-10 h-10 rounded-md bg-doodle-yellow border-2 border-black flex items-center justify-center">
                <span className="text-black text-lg">D</span>
              </div>
              <span>DoodleDict</span>
            </Link>
            
            <p className="text-gray-700 mb-6 max-w-xs">
              Helping children learn vocabulary through creative doodling and visual memory techniques.
            </p> 
          </div>
        </div>
        
        <div className="border-t-2 border-black mt-2 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-700 text-sm">
            © {new Date().getFullYear()} DoodleDict. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <a href="mailto:contact@doodledict.com" className="text-gray-700 hover:text-black font-medium transition-colors text-sm flex items-center gap-1 border-2 border-black rounded-md px-3 py-1">
              <Mail className="w-4 h-4" />
              <span>contact@doodledict.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
