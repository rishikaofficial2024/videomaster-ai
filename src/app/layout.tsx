import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - India\'s #1 Professional AI Video Studio',
  description: 'Produce viral AI videos 10x faster with Gemini Fast AI. Created by Rinku Ganjawala.',
  keywords: ['AI Video Maker', 'Viral Script Writer', 'VideoMaster AI Tech', 'Gemini AI Video', 'YouTube Shorts AI', 'Video Editor India', 'Rinku Ganjawala', 'Professional Video Editor'],
  authors: [{ name: 'Rinku Ganjawala', url: 'https://videomaster-ai.tech' }],
  creator: 'Rinku Ganjawala',
  publisher: 'VideoMaster AI Technologies',
  metadataBase: new URL('https://videomaster-ai.tech'),
  alternates: { canonical: '/' },
  verification: {
    google: 'google-site-verification-id-verified', 
  },
  openGraph: {
    title: 'VideoMaster AI - The Ultimate Neural Production Studio',
    description: 'Transform cinematic ideas into professional video assets. Created by Rinku Ganjawala.',
    url: 'https://videomaster-ai.tech',
    siteName: 'VideoMaster AI',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: 'https://picsum.photos/seed/videomaster-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI Studio',
    description: 'High-speed viral video generation powered by Google AI. Created by Rinku Ganjawala.',
    images: ['https://picsum.photos/seed/videomaster-tw/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-8946933317699938";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VideoMaster AI",
    "url": "https://videomaster-ai.tech",
    "operatingSystem": "Android, Web",
    "applicationCategory": "MultimediaApplication",
    "author": {
      "@type": "Person",
      "name": "Rinku Ganjawala",
      "email": "rinkukumarpaswan1796@gmail.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#020202" />
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`} crossOrigin="anonymous"></script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
