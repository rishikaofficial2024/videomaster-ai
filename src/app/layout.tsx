import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - India\'s #1 Professional AI Video Studio',
  description: 'Create viral AI videos 10x faster with Gemini Fast AI. Professional script writing, cinematic video generation, and 4K thumbnail design.',
  keywords: ['AI Video Maker', 'Viral Script Writer', 'VideoMaster AI Tech', 'Gemini AI Video', 'YouTube Shorts AI'],
  metadataBase: new URL('https://videomaster-ai.tech'),
  alternates: { canonical: '/' },
  verification: {
    google: 'google-site-verification-id-placeholder', 
  },
  openGraph: {
    title: 'VideoMaster AI - The Ultimate Neural Production Studio',
    description: 'Transform cinematic ideas into professional video assets with Gemini Fast AI.',
    url: 'https://videomaster-ai.tech',
    siteName: 'VideoMaster AI',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: 'https://picsum.photos/seed/videomaster-og/1200/630', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VideoMaster AI",
    "url": "https://videomaster-ai.tech",
    "operatingSystem": "Android, Web",
    "applicationCategory": "MultimediaApplication",
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
        <meta name="theme-color" content="#05070a" />
        
        {/* 📊 ADSENSE & ANALYTICS */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8946933317699938" crossOrigin="anonymous"></script>
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
