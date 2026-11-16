import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'CareerPulse AI — Find Your Next Opportunity with AI',
  description:
    'Enterprise AI-Powered Job Discovery, ATS Resume Optimization, Company Insights & Tech Mentorship Platform.',
  keywords: [
    'AI job search',
    'Bengaluru tech jobs',
    'software engineer salaries India',
    'ATS resume builder',
    'mock interview mentorship',
    'CareerPulse AI',
  ],
};

const clerkKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('sample')
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : 'pk_test_Y2FyZWVycHVsc2UuY2xlcmsuYWNjb3VudHMuZGV2JA==';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${jakarta.variable} font-sans min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster position="top-right" richColors />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
