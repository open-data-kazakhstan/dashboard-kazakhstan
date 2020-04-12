import React from 'react';


const Header = () => (
  <nav className="flex items-center justify-between flex-wrap bg-white py-6 px-6 md:px-16 shadow-sm">
    <div className="flex items-center flex-shrink-0 text-gray-600 mr-6">
      <span className="font-semibold text-xl tracking-tight">KAZAKHSTAN DASHBOARD</span>
    </div>
    <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div className="text-sm lg:flex-grow">

      </div>

      <div>
        <a href="https://datahub.io/anuveyatsu" target="_blank" className="block mt-4 lg:ml-6 lg:inline-block lg:mt-0 text-sm text-gray-700 hover:text-black">
          DATAHUB
        </a>
        <a href="https://github.com/anuveyatsu" target="_blank" className="block mt-4 lg:ml-6 lg:inline-block lg:mt-0 text-sm text-gray-700 hover:text-black">
          GITHUB
        </a>
      </div>
    </div>
  </nav>
)


export default Header;
