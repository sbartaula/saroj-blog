import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Footer, Navbar } from "@/components/ui";
import LanguageProvider from "@/providers/LanguageProvider";
import Theme from "@/providers/ThemeProvider";
import { Analytics } from '@vercel/analytics/react'; // Vercel Analytics
import { SpeedInsights } from '@vercel/speed-insights/next';
import dynamic from "next/dynamic";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { bodyFont, headingFont, nepaliFont } from "./fonts";
import "./globals.css";

// Lazy-load heavy client widgets — not needed for initial paint
const LazyChatWidget = dynamic(
  () => import("@/components/chat/ChatWidget").then((mod) => ({ default: mod.ChatWidget })),
  { ssr: false }
);

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";
const PROFILE_SAME_AS = [
  "https://sbartaula.github.io/",
  "https://www.linkedin.com/in/man-on-mission/",
  "https://github.com/saroj479",
  "https://www.imdb.com/name/nm10841378/",
  SITE_URL,
];

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "Saroj Bartaula",
  url: SITE_URL,
  mainEntity: {
    "@type": "Person",
    name: "Saroj Bartaula",
    alternateName: "Man on Mission",
    jobTitle: ["Writer", "Filmmaker", "Builder"],
    description:
      "Writer, filmmaker, builder exploring technology, storytelling, science, films, books, and ideas.",
    sameAs: PROFILE_SAME_AS,
    knowsAbout: ["Technology", "Storytelling", "Science", "Films", "Books", "Ideas"],
  },
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Saroj Bartaula",
    default: "Saroj Bartaula | Technology, Film, Startups & Ideas",
  },
  description:
    "Welcome to my blog, a space where I share my insights on various topics including science, technology, Effective Accelerationism, machine learning, space travel, startup experiences, and personal stories. Each post offers a glimpse into my mind and my journey.",
  alternates: {
    canonical: './',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profileJsonLd),
          }}
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />

        {/* Google Analytics via GTM */}
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${bodyFont.variable} ${bodyFont.className} ${headingFont.variable} ${nepaliFont.variable} antialiased`}>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        <ToastContainer />
        <ErrorBoundary>
          <LanguageProvider>
            <Theme>
              <Navbar />
              <main>{children}</main>
              <SpeedInsights />
              <Analytics /> {/* Vercel Analytics */}
              <Footer />
              <LazyChatWidget />
            </Theme>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}