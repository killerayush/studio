
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VYXEN | No fit? Vyxen it.',
  description: 'AI-powered fashion stylist that builds your perfect outfit based on your vibe, body, and occasion — instantly.',
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
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
