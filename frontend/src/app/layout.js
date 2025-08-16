import ThemeRegistry from '../components/ThemeRegistry';

export const metadata = {
  title: 'Simple AI Chat',
  description: 'A simple chat app with Next.js and FastAPI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}