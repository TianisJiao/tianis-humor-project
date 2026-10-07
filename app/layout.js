import "./globals.css";

export const metadata = {
  title: "The Punchline Club | The Humor Project",
  description: "Bring a photo. Get three AI punchlines. Vote for your favorite at The Punchline Club.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
