import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "./shared/breadcrumb/Breadcrumb";
import Home from "@/ui/Home";

const BCrumb = [
  {
    title: "Home",
  },
];

export default function DashboardHome() {
  return (
    <PageContainer title="General">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      <Home />
    </PageContainer>
  )
}