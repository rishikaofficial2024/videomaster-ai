import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - Free AI Video Generator & Viral Script Maker',
  description: 'Create viral YouTube Shorts and Reels 10x faster. VideoMaster AI is the world\'s most stable studio for global creators. Get 100 FREE AI credits on signup!',
  keywords: [
    'Free AI Video Generator', 
    'AI Script Writer for YouTube', 
    'Viral Reels Maker AI', 
    'Cinematic AI Thumbnail Maker', 
    'VideoMaster AI Tech Studio',
    'Best AI Tool for Content Creators',
    'VideoMaster-AI.tech'
  ],
  metadataBase: new URL('https://videomaster-ai.tech'),
  alternates: { 
    canonical: '/',
  },
  openGraph: {
    title: 'VideoMaster AI - Elite Viral Studio for Modern Creators',
    description: 'Transform your ideas into professional videos with AI. 100 Free Credits inside!',
    url: 'https://videomaster-ai.tech',
    siteName: 'VideoMaster AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/videomaster-og/1200/630',
        width: 1200,
        height: 630,
        alt: 'VideoMaster AI Professional Design Studio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI - Master the Viral Social Game',
    description: 'The first elite AI design studio for tech-savvy creators. 10x faster workflow.',
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
  // 📈 ELITE JSON-LD STRUCTURED DATA (Google loves this!)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VideoMaster AI",
    "url": "https://videomaster-ai.tech",
    "description": "Professional AI Video Generator & Script Writer for Content Creators",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web, Android, iOS",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "AI Video Generation",
      "Viral Script Writing",
      "4K Thumbnail Designer",
      "Automatic Subtitles",
      "Neural Chat Assistant"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is VideoMaster AI free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, VideoMaster AI offers 100 free AI credits to all new users to explore the studio and generate professional videos."
        }
      },
      {
        "@type": "Question",
        "name": "How do I make a viral video with AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use our Viral Optimizer and Script Writer tools to create high-engagement content and trending hashtags optimized for search algorithms."
        }
      }
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#05070a" />
        
        {/* 🧠 Neural SEO Handshake */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        {/* 💰 Official AdSense Node */}
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
