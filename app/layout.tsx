import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export const metadata = {
  title: "Mission Control",
  description: "Premium command center for AI agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="antialiased flex min-h-screen"
        style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}
      >
        <ConvexClientProvider>
          <Sidebar />
          <main className="ml-[260px] flex-1 overflow-y-auto px-10 pb-10 pt-8">
            {children}
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
