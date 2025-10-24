import "@/styles/globals.css";

export const metadata = {
  title: "Learning Admin Dashboard",
  description: "Admin dashboard built with Next.js and ShadCN UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
