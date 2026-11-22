import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"], variable: "--serif" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--sans" });

const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata = {
  metadataBase: new URL(host ? `https://${host}` : "http://localhost:3000"),
  title: "Sai Dheekshit & tejasvi · Wedding",
  description: "You are invited to the wedding of Gaddam Sai Dheekshit & Kashan tejasvi · 26 November 2026",
  openGraph: { title: "Sai Dheekshit & tejasvi", description: "Wedding · 26 November 2026 · Zoroastrian Club", images: ["/photos/1.jpg"] },
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f6e4e1" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
