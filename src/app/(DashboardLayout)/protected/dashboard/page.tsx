import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";
import Dashboard from "@/ui/Dashboard";

const BCrumb = [
  {
    title: "Tableau de board",
  },
];

export default function DashboardPage() {
  return (
    <PageContainer title="Tableau de board">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      <Dashboard />
    </PageContainer>
  );
}