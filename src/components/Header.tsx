"use client"
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from '@/components/Container';
import { ModeToggle } from './ModeToggle';

const Header = () => {
  const pathname = usePathname();
  const hideSlash = ['/', '/sign-in', '/sign-up'].includes(pathname || '');
  return (
    <header className='mt-8 mb-12'>
      <Container>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-4'>
              <p className='font-bold'>
                <Link href='/dashboard'>Invoicipedia</Link>
              </p>
              {!hideSlash && <span className='text-slate-300'>/</span>}
              <SignedIn>
                <span className='-ml-2'>
                  <OrganizationSwitcher afterCreateOrganizationUrl='/dashboard' />
                </span>
              </SignedIn>
            </div>
            <SignedIn>
              <span className='-ml-2'></span>
            </SignedIn>
          </div>
          <div className='flex items-center gap-4'>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <ModeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
