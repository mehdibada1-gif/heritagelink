import type {Metadata} from 'next';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import { alegreya } from '@/app/fonts';
import { TopHeader } from '@/components/layout/top-header';
import { BottomNavbar } from '@/components/layout/bottom-navbar';

export const metadata: Metadata = {
  title: 'Heritagelink',
  description: 'Preserving and sharing cultural stories from around the world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${alegreya.variable} font-body antialiased`} suppressHydrationWarning>
        <AuthProvider>
            <div className="relative mx-auto flex min-h-screen max-w-lg flex-col border-x bg-background shadow-lg">
              <TopHeader />
              <main className="flex-1 pb-20">{children}</main>
              <Footer />
              <BottomNavbar />
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
