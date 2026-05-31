import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "EdupiSchool — Learn FSD, DSA & GenAI from Kashmir's Own",
  description:
    "Join Adfar Rasheed's live weekly batches in Full Stack Development, DSA, and Generative AI. Premium tech education from Kashmir — batches, masterclasses, and hands-on mentorship.",
  keywords: "FSD course, DSA, Generative AI, Kashmir tech, live online classes, Adfar Rasheed",
  openGraph: {
    title: "EdupiSchool — Learn FSD, DSA & GenAI from Kashmir's Own",
    description:
      "Premium tech education from Kashmir. Join live weekly batches and masterclasses by Adfar Rasheed.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-sans)" }}>{children}</body>
    </html>
  );
}
