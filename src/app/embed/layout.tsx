// app/embed/layout.tsx
import { Roboto_Condensed } from "next/font/google";
import "../globals.css";

const inter = Roboto_Condensed({ subsets: ["latin"] });

export const metadata = {
  title: "Testimonials Embed",
  description: "Embedded testimonials view",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}  w-full h-full`}>{children}</body>
    </html>
  );
}
