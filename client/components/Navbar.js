import { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const account = useSelector(state => state.web3Reducer.account);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Contributions", href: "/my-contributions" },
    { label: "Create Fundraiser", href: "/create-fundraiser" }
  ];

  return (
    <nav className="bg-[#F7F5F2] border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="CrowdMint Logo" className="h-8 w-8 object-contain" />
            <Link href="/dashboard">
              <span
                className="text-2xl font-bold text-[#1D174D] hover:cursor-pointer"
                style={{ fontFamily: 'Kristen ITC, cursive' }}
              >
                CrowdMint
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map(({ label, href }) => (
              <Link key={href} href={href}>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    router.pathname === href
                      ? 'bg-[#F7C984] text-[#1D174D]'
                      : 'text-gray-600 hover:bg-[#F7C984] hover:text-[#1D174D]'
                  } hover:cursor-pointer`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Wallet Address and Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-block max-w-[160px] truncate text-sm font-medium text-[#1D174D]">
              {account || 'Not connected'}
            </span>
            <div className="md:hidden">
              <button
                onClick={() => setOpenMenu(prev => !prev)}
                className="text-gray-600 hover:text-[#1D174D] focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="md:hidden bg-[#F7F5F2] px-4 pt-4 pb-3 space-y-2">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href}>
              <span
                className={`block w-full px-4 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  router.pathname === href
                    ? 'bg-[#F7C984] text-[#1D174D]'
                    : 'text-gray-700 hover:bg-[#F7C984] hover:text-[#1D174D]'
                } hover:cursor-pointer`}
              >
                {label}
              </span>
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-200 text-sm text-[#1D174D] truncate">
            Wallet: {account || 'Not connected'}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
