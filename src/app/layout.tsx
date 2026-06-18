import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - India\'s #1 Professional AI Video Studio',
  description: 'Create viral YouTube, TikTok, and Reels 10x faster with VideoMaster AI. Features: AI Script Writer, Cinematic Thumbnail Maker, and Veo 2.0 Video Generation. Get 100 free credits and start earning today!',
  keywords: ['AI Video Editor', 'Video Generation', 'Thumbnail Maker', 'AI Scripts', 'YouTube Tools', 'TikTok Editor', 'Monetize Video', 'Viral Reels Maker'],
  authors: [{ name: 'VideoMaster AI Global' }],
  openGraph: {
    title: 'VideoMaster AI - The Future of Content Creation',
    description: 'The all-in-one AI video studio built to help creators earn more and work less.',
    url: 'https://videomaster-ai.web.app',
    siteName: 'VideoMaster AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI',
    description: 'Turn text into viral videos in seconds with our elite AI engine.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#05070a" />
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