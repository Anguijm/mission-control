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
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 flex min-h-screen">
        <ConvexClientProvider>
          <Sidebar />
          <main className="flex-1 ml-64 p-8 overflow-y-auto">{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
