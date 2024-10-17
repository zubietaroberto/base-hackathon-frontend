import type { Metadata } from "next";
import "./globals.css";
import { CssBaseline } from "@mui/material";

export const metadata: Metadata = {
  title: "OnChain Explorer",
  description: "Explore the loan contract on the blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CssBaseline>
      <html lang="es">
        <body>{children}</body>
      </html>
    </CssBaseline>
  );
}
