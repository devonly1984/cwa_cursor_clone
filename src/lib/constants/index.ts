import { IBM_Plex_Mono, Inter } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ['400','500','600','700']
});

export const URL_REGEXP = /https?:\/\/[^s]+/g;