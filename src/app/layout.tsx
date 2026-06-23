import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - Professional AI Video Studio',
  description: 'Produce viral AI content 10x faster. Stable, professional design studio for global creators. Claim 100 FREE AI credits.',
  keywords: ['AI Video Maker', 'Viral Script Writer', 'Cinematic AI', 'VideoMaster AI Tech'],
  manifest: '/manifest.json',
  metadataBase: new URL('https://studio-9489287013-59986.web.app'),
  alternates: { canonical: '/' },
  verification: {
    google: '', // Add your Google Site Verification code here from Search Console
  },
  openGraph: {
    title: 'VideoMaster AI - The Ultimate Production Studio',
    description: 'Transform cinematic ideas into professional video assets with Elite AI.',
    url: 'https://studio-9489287013-59986.web.app',
    siteName: 'VideoMaster AI',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://picsum.photos/seed/videomaster-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI - Master the Viral Social Game',
    images: ['https://picsum.photos/seed/videomaster-twitter/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#05070a" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google AdSense Hub Integration */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8946933317699938" crossOrigin="anonymous"></script>
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}