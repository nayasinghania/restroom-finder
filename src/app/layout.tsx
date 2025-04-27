import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";
import ModeToggle from "@/components/theme/mode-toggle";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Restroom Finder",
  description: "Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div>{children}</div>
              <ModeToggle />
            </ThemeProvider>
          </body>
        </body>
      </html>
    </ClerkProvider>
  );
}
