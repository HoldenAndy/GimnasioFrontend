import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}
