import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import Container from '@/components/Container';
import { ModeToggle } from './ModeToggle';

const Header = () => {
  return (
    <header className='mt-8 mb-12'>
      <Container>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center gap-4'>
            <p className='font-bold'>
              <Link href='/dashboard'>Invoicipedia</Link>
            </p>
            <SignedIn>
              <span className='-ml-2'></span>
            </SignedIn>
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          <ModeToggle />
        </div>
      </Container>
    </header>
  );
};

export default Header;
