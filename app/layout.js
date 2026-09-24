import "./globals.css";

export const metadata = {
  title: "Caption Ideas | The Humor Project",
  description: "Caption ideas fetched from Supabase for The Humor Project.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
