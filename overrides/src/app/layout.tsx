import { metaData } from '@/metaData/metaData';
import StyledComponentsRegistry from '@/providers/styledComponents';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { themeInfo } from '@/style/StyleManager';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import '@/style/globals.css';

const { googleFontsUrl, localFontFaces, cssVariablesAsStyle } = themeInfo;

export const metadata: Metadata = metaData;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning style={cssVariablesAsStyle}>
      <head>
        {/* Google Fonts 로드 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={googleFontsUrl} rel="stylesheet" />

        {/* 로컬 폰트 @font-face 주입 */}
        {localFontFaces && (
          <style dangerouslySetInnerHTML={{ __html: localFontFaces }} />
        )}
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          <Toaster duration={1600} closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
