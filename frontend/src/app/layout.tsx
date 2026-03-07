import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Babypakka.no – Lei babyutstyr tilpasset barnets alder',
    template: '%s | Babypakka.no',
  },
  description: 'Abonnementstjeneste for babyutstyr. Lei alderstilpassede utstyrspakker for baby og småbarn.',
  metadataBase: new URL('https://babypakka.no'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    siteName: 'Babypakka.no',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Babypakka.no – Lei babyutstyr tilpasset barnets alder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Babypakka.no – Lei babyutstyr tilpasset barnets alder',
    description: 'Abonnementstjeneste for babyutstyr. Lei alderstilpassede utstyrspakker for baby og småbarn.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Babypakka.no',
    url: 'https://babypakka.no',
    logo: 'https://babypakka.no/icon.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hei@babypakka.no',
      contactType: 'customer service',
      availableLanguage: 'Norwegian',
    },
    sameAs: [],
  };

  return (
    <html lang="nb">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
