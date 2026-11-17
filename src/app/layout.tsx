import type { Metadata, Viewport } from "next";
import { siteMetadata, siteViewport } from "./site-config";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import Script  from "next/script";

import "./globals.css";
import React from "react";

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
   {/* Google tag (gtag.js) */}
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JWPND7VDCL"></script>
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-JWPND7VDCL');
    `,
  }}
/>
      </head>
      <body className="bg-white dark:bg-gray-900">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
          <Analytics />
          <Script
            id="remove-vercel-toolbar"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  function removeToolbar() {
                    var selectors = ['vercel-live-feedback', 'vercel-toolbar', '#vercel-live-feedback', '[data-vercel-toolbar]'];
                    selectors.forEach(function(sel) {
                      var el = document.querySelector(sel);
                      if (el) el.remove();
                    });
                  }
                  removeToolbar();
                  var observer = new MutationObserver(removeToolbar);
                  observer.observe(document.documentElement, { childList: true, subtree: true });
                })();
              `,
            }}
          />
      </body>
    </html>
  );
}
