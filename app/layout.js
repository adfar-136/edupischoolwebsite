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
  title: "EdupiSchool — Premium Grassroots Tech Academy",
  description:
    "Join live, expert-led cohorts in Full Stack Development, DSA, Data Science, and Cyber Security. Premium grassroots upskilling academy with hands-on mentoring.",
  keywords: "FSD course, DSA, Generative AI, Data Science, Cyber Security, Kashmir tech, live online classes, EdupiSchool",
  openGraph: {
    title: "EdupiSchool — Premium Grassroots Tech Academy",
    description:
      "Premium upskilling cohorts and masterclasses in engineering, data, and security.",
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
