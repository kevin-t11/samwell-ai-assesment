'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <Image src="/samwell_logo.svg" alt="Samwell" width={40} height={40} />
        <Link href="/" className="text-2xl font-bold">
          <span className="flex items-center">
            <span className="text-blue-500">sam</span>
            <span className="text-black">well.ai</span>
          </span>
        </Link>
      </div>

      <SignedOut>
        <nav className="hidden md:flex space-x-8">
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/examples" className="text-gray-600 hover:text-gray-900">
            Examples
          </Link>
          <Link href="/affiliate" className="text-gray-600 hover:text-gray-900">
            Affiliate
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-gray-900">
            Products
          </Link>
        </nav>
      </SignedOut>

      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              Login
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
              Sign-up for Free
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;