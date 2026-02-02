import NavHeader from "@/components/layout/nav-header";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <header className="border shadow-sm">
        <NavHeader />
      </header>
      <main className="min-h-screen p-10">{children}</main>
    </body>
  );
}
