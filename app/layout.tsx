import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export const metadata = {
  title: "Mission Control",
  description: "Internal dashboard for OpenClaw agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
        <ConvexClientProvider>
          <Sidebar />
          <main className="ml-64 flex-1 overflow-y-auto p-8">{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
