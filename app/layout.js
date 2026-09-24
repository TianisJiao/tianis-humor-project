import "./globals.css";

export const metadata = {
  title: "Hello World | The Humor Project",
  description: "A small beginning for a semester of building.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
