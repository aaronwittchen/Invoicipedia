'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function SignInPage() {
  const { theme } = useTheme();

  const passkeyLogo =
    theme === 'dark' ? '/passkey-light.webp' : '/passkey-dark.webp';

  return (
    <div className='grid w-full flex-grow items-center bg-background px-4 sm:justify-center'>
      <SignIn.Root>
        {/* Start Step */}
        <SignIn.Step
          name='start'
          className='w-full space-y-6 rounded-2xl px-4 py-10 sm:w-96 sm:px-8 bg-card shadow-lg border'
        >
          <header className='text-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='mx-auto size-10 text-foreground'
              viewBox='0 0 24 24'
            >
              <title>Logo</title>
              <path d='M16 20V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v16' />
              <rect width='20' height='14' x='2' y='6' rx='2' />
            </svg>
            <h1 className='mt-4 text-xl font-medium tracking-tight text-foreground'>
              Sign in to Invoicipedia
            </h1>
          </header>
          <Clerk.GlobalError className='block text-sm text-destructive' />
          <Clerk.Field name='identifier'>
            <Clerk.Label className='sr-only'>Email</Clerk.Label>
            <Clerk.Input
              type='email'
              required
              placeholder='Email'
              className='w-full border-b border-border 
                         bg-background
                         pb-2 text-sm/6 text-foreground
                         outline-none placeholder:text-muted-foreground
                         hover:border-border/80
                         focus:border-ring
                         data-[invalid]:border-destructive data-[invalid]:text-destructive'
            />
            <Clerk.FieldError className='mt-2 block text-xs text-destructive' />
          </Clerk.Field>
          <SignIn.Action submit asChild>
            <Button className='w-full font-bold'>Sign In</Button>
          </SignIn.Action>

          {/* Social / Alternative Logins */}
          <div>
            <p className='mb-4 text-center text-sm/5 text-muted-foreground'>
              Alternatively, sign in with these platforms
            </p>
            <div className='space-y-2'>
              <p className='text-center'>
                <SignIn.Passkey asChild>
                  <Button
                    className='w-full flex items-center justify-center gap-1 font-bold'
                    variant='outline'
                  >
                    <Image
                      src={passkeyLogo}
                      alt='Passkey Logo'
                      width={18}
                      height={18}
                    />
                    Continue with Passkey
                  </Button>
                </SignIn.Passkey>
              </p>
              <Clerk.Connection name='github' asChild>
                <Button
                  className='flex gap-2 w-full font-bold'
                  variant='outline'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-4 text-foreground'
                  >
                    <title>GitHub Logo</title>
                    <path d='M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2Z' />
                  </svg>
                  Login with GitHub
                </Button>
              </Clerk.Connection>
              <Clerk.Connection name='google' asChild>
                <Button
                  className='flex gap-2 w-full font-bold'
                  variant='outline'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 16 16'
                    aria-hidden
                    className='size-4 text-foreground'
                  >
                    <title>Google Logo</title>
                    <g clipPath='url(#a)'>
                      <path
                        fill='currentColor'
                        d='M8.32 7.28v2.187h5.227c-.16 1.226-.57 2.124-1.192 2.755-.764.765-1.955 1.6-4.035 1.6-3.218 0-5.733-2.595-5.733-5.813 0-3.218 2.515-5.814 5.733-5.814 1.733 0 3.005.685 3.938 1.565l1.538-1.538C12.498.96 10.756 0 8.32 0 3.91 0 .205 3.591.205 8s3.706 8 8.115 8c2.382 0 4.178-.782 5.582-2.24 1.44-1.44 1.893-3.475 1.893-5.111 0-.507-.035-.978-.115-1.369H8.32Z'
                      />
                    </g>
                    <defs>
                      <clipPath id='a'>
                        <path fill='#fff' d='M0 0h16v16H0z' />
                      </clipPath>
                    </defs>
                  </svg>
                  Login with Google
                </Button>
              </Clerk.Connection>
            </div>
          </div>

          <p className='text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link
              href={String(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL)}
              className='rounded px-1 py-0.5 text-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground'
            >
              Sign up
            </Link>
          </p>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
