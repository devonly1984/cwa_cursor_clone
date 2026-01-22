import { IBM_Plex_Mono, Inter, Poppins } from "next/font/google";


export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ['400','500','600','700']
});
export const poppins = Poppins({
  subsets:['latin'],
  weight: ['400', '500', '600', '700']
})
export const URL_REGEXP = /https?:\/\/[^s]+/g;

export const MIN_SIDEBAR_WIDTH=200;
export const MAX_SIDEBAR_WIDTH=800;
export const DEFAULT_SIDEBAR_WIDTH=400;
export const DEFAULT_MAIN_SIZE = 1000;


export const BASE_PADDING=12;
export const LEVEL_PADDING = 12;
