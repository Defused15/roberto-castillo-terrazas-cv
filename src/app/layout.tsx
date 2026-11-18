import type {Metadata, Viewport} from 'next';
import {siteMetadata, siteViewport} from './site-config';
import {Analytics} from '@vercel/analytics/react';
import {Inter} from 'next/font/google';
import {ThemeProvider} from '@/components/theme-provider';
import {LanguageProvider} from '@/components/language-provider';
import {AnalyticsProvider} from '@/components/analytics-provider';
import Script from 'next/script';

import './globals.css';
import React from 'react';

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

/**
 * Vercel sets VERCEL=1 during its builds. Web Analytics and the toolbar only exist
 * there; elsewhere (local `next start`, CI) /_vercel/insights/script.js would 404
 * and log console errors.
 */
const onVercel = process.env.VERCEL === '1';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        <AnalyticsProvider />
        {onVercel ? (
          <>
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
          </>
        ) : null}
      </body>
    </html>
  );
}
