import "./globals.css";

export const metadata = {
  title: "Caption Ideas | The Humor Project",
  description: "Caption ideas, Google sign-in, and a private profile powered by Supabase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
