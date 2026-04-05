import React from 'react';

const Footer = ({ darkMode }) => {
  return (
    <footer
      className={`text-center p-4 mt-10 transition-colors duration-300
        ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}
      `}
    >
      <p className="text-sm">
        © {new Date().getFullYear()} Finance Dashboard | Built by Vartika Singh 🌸🚀
      </p>
    </footer>
  );
};

export default Footer;