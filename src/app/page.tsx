import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className='flex flex-col justify-center items-center text-center gap-6 max-w-5xl mx-auto'>
      <h1 className='text-5xl font-bold'>Invoicipedia</h1>

      <div className='flex gap-4'>
        <SignedOut>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Register</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </main>
  );
}
