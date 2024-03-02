import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const isScrolled = scrollPosition > 0;
      setIsHeaderVisible(!isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`w-full h-16 flex border-b-4 border-gray-400 items-center justify-around rounded-b-2xl bg-gray-300 shadow-md transition-opacity ${
        isHeaderVisible ? 'opacity-100' : 'opacity-60'
      } fixed top-0 left-0 z-50`}
    >
      <div className="w-1/4 flex ">
        <Link
          to="/"
          className="text-4xl font-bold text-blue-800"
          onClick={scrollToTop}
        >
          Photo Gallery
        </Link>
      </div>
      <div className="w-1/6 flex align-items justify-around">
        <Link
          className="text-2xl text-blue-600 font-bold"
          to="/"
          onClick={scrollToTop}
        >
          Home
        </Link>
        <Link className="text-2xl text-blue-600 font-bold" to="/history">
          History
        </Link>
      </div>
    </div>
  );
}

export default Header;
