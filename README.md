# Invoicipedia

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-payments-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://<your-vercel-url>)

A modern, full-stack invoicing application built with Next.js 15, featuring multi-currency support, Stripe payments, and professional email notifications.

## What It Does

- **Invoice Management**: Create, edit, and track invoices with professional templates
- **Multi-Currency Support**: Handle invoices in USD ($) and EUR (€) with proper formatting
- **Payment Processing**: Integrated Stripe checkout for secure online payments
- **Customer Management**: Store and manage customer information and billing details
- **Status Tracking**: Monitor invoice status (open, paid, void, uncollectible)
- **Email Notifications**: Automated email alerts when invoices are created
- **User Authentication**: Secure user management with Clerk authentication
- **Organization Support**: Multi-tenant architecture for teams and organizations

## Key Features

### Core Functionality

- **Invoice Creation**: Simple form-based invoice creation with currency selection
- **Dashboard**: Paginated invoice overview with filtering and search capabilities
- **Payment Integration**: Seamless Stripe checkout with automatic status updates
- **Email Templates**: Professional, customizable email notifications
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

### Financial Features

- **Multi-Currency**: Support for USD and EUR with proper symbol display
- **Amount Handling**: Automatic conversion to cents for precise financial calculations
- **Payment Confirmation**: User-friendly payment confirmation workflow
- **Status Management**: Comprehensive invoice lifecycle management

### Security & Authentication

- **User Authentication**: Secure login/signup with Clerk
- **Organization Isolation**: Multi-tenant data separation
- **Form Validation**: Server-side validation and error handling
- **Secure Payments**: PCI-compliant payment processing via Stripe

### User Experience

- **Modern UI**: Clean, professional interface with dark/light theme support
- **Pagination**: Efficient handling of large invoice lists (20 per page)
- **Real-time Updates**: Optimistic UI updates for better user experience
- **Accessibility**: Screen reader friendly with proper ARIA labels

## Technologies

### Frontend

- **Next.js 15**: React framework with App Router and Server Components
- **TypeScript**: Type-safe development with strict type checking
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible, unstyled UI components
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons

### Backend & Database

- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **PostgreSQL**: Robust, scalable relational database
- **Next.js Server Actions**: Server-side form handling and API endpoints

### Authentication & Payments

- **Clerk**: Complete authentication and user management solution
- **Stripe**: Payment processing and checkout integration
- **Resend**: Transactional email delivery service

### Development Tools

- **Drizzle Kit**: Database migrations and schema management
- **React Email**: Email template development and preview
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing and optimization

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- Clerk account
- Resend account (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-invoicing-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   # Database
   XATA_DATABASE_URL=postgresql://user:password@localhost:5432/invoicing

   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret

   # Payments
   STRIPE_API_SECRET=your_stripe_secret
   STRIPE_PRODUCT_ID=your_stripe_product

   # Email (optional)
   RESEND_API_KEY=your_resend_key
   ```

4. **Set up the database**

   ```bash
   npm run generate  # Generate migrations
   npm run migrate   # Apply migrations
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate` - Generate database migrations
- `npm run migrate` - Apply database migrations
- `npm run email` - Start email development server

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Invoice dashboard with pagination
│   ├── invoices/          # Invoice management routes
│   └── actions.ts         # Server actions for forms
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix UI)
│   └── CurrencySelector.tsx # Currency selection component
├── db/                   # Database configuration
│   ├── schema.ts         # Drizzle schema definitions
│   └── migrations/       # Database migration files
├── emails/               # Email templates
├── lib/                  # Utility functions
│   ├── currency.ts       # Currency handling utilities
│   └── utils.ts          # General utilities
└── data/                 # Static data and constants
```

## Features in Detail

### Currency System

- **USD Support**: Dollar symbol ($) and proper formatting
- **EUR Support**: Euro symbol (€) and proper formatting
- **Extensible**: Easy to add new currencies
- **Type Safety**: Full TypeScript support for currency operations

### Pagination System

- **Efficient Loading**: 20 invoices per page for optimal performance
- **Smart Navigation**: Previous/Next with page number selection
- **URL State**: Pagination state maintained in URL for sharing
- **Count Display**: Shows current range and total count

### Payment Workflow

1. User creates invoice with selected currency
2. Customer receives email notification
3. Customer clicks payment link
4. Stripe checkout processes payment
5. User confirms payment success
6. Invoice status updates to "paid"
