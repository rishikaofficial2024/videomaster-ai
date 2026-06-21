import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - Professional AI Video Studio & Viral Script Maker',
  description: 'Produce high-converting YouTube Shorts and Reels 10x faster. VideoMaster AI is a stable, professional design studio for global creators. Claim 100 FREE AI credits on registration.',
  keywords: [
    'Professional AI Video Generator', 
    'Viral Script Writer for Social Media', 
    'HD Reel Maker AI', 
    'Cinematic AI Thumbnail Designer', 
    'VideoMaster AI Tech Studio',
    'Best AI Production Tool for Creators',
    'VideoMaster-AI.tech'
  ],
  metadataBase: new URL('https://videomaster-ai.tech'),
  alternates: { 
    canonical: '/',
  },
  verification: {
    // 🔑 SEO VERIFICATION: Replace 'YOUR_VERIFICATION_CODE_HERE' with your code from Google Search Console.
    google: 'YOUR_VERIFICATION_CODE_HERE',
  },
  openGraph: {
    title: 'VideoMaster AI - The Ultimate Production Studio for Modern Creators',
    description: 'Transform cinematic ideas into professional video assets with Elite AI. 100 Free Credits included!',
    url: 'https://videomaster-ai.tech',
    siteName: 'VideoMaster AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/videomaster-og/1200/630',
        width: 1200,
        height: 630,
        alt: 'VideoMaster AI Professional Design Studio Mission Control',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI - Master the Viral Social Game',
    description: 'The premier AI design studio for tech-savvy content creators. 10x faster production workflow.',
    images: ['https://picsum.photos/seed/videomaster-twitter/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
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
    "description": "Professional AI Video Production & Scripting Engine for Social Media Creators",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web, Android, iOS",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "AI Video Production",
      "Viral Script Engineering",
      "4K Cinematic Thumbnail Designer",
      "Automated Production Subtitles",
      "Neural Chat Assistant"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#05070a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* 💰 Global AdSense Integration */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8946933317699938" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-8946933317699938" />
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
