import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-slate-800">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
