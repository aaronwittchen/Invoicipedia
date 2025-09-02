'use client';

import {
  Root as SignUpRoot,
  Step as SignUpStep,
  Action as SignUpAction,
} from '@clerk/elements/sign-up';
import {
  Connection,
  GlobalError,
  Field,
  FieldError,
  Label,
  Input,
} from '@clerk/elements/common';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className='grid w-full flex-grow items-center bg-background px-4 sm:justify-center'>
      <SignUpRoot>
        <SignUpStep
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
              Create your Invoicipedia account
            </h1>
          </header>

          <GlobalError className='block text-sm text-destructive' />

          {/* Email field */}
          <Field name='email'>
            <Label className='sr-only'>Email</Label>
            <Input
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
            <FieldError className='mt-2 block text-xs text-destructive' />
          </Field>

          {/* Password field */}
          <Field name='password'>
            <Label className='sr-only'>Password</Label>
            <Input
              type='password'
              required
              placeholder='Password'
              className='w-full border-b border-border 
                         bg-background
                         pb-2 text-sm/6 text-foreground
                         outline-none placeholder:text-muted-foreground
                         hover:border-border/80
                         focus:border-ring
                         data-[invalid]:border-destructive data-[invalid]:text-destructive'
            />
            <FieldError className='mt-2 block text-xs text-destructive' />
          </Field>

          <SignUpAction submit asChild>
            <Button className='w-full font-bold'>Sign Up</Button>
          </SignUpAction>

          {/* Alternative providers */}
          <div>
            <p className='mb-4 text-center text-sm/5 text-muted-foreground'>
              Alternatively, sign up with these platforms:
            </p>
            <div className='space-y-2'>
              <Connection name='github' asChild>
                <Button
                  className='flex gap-2 w-full font-bold'
                  variant='outline'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 16 16'
                    fill='currentColor'
                    className='size-4 text-foreground'
                  >
                    <title>GitHub Logo</title>
                    <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
                  </svg>
                  Sign up with GitHub
                </Button>
              </Connection>
              <Connection name='google' asChild>
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
                  Sign up with Google
                </Button>
              </Connection>
            </div>
          </div>

          {/* Sign in link */}
          <p className='text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href={
                String(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL) || '/sign-in'
              }
              className='rounded px-1 py-0.5 text-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground'
            >
              Sign in
            </Link>
          </p>
        </SignUpStep>
      </SignUpRoot>
    </div>
  );
}
