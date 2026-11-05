import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";
import Admin_Sessions from "@/ui/admin/Admin_Sessions";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sessions actives",
  },
];

const Admin_Sessions_Page = () => {
  return (
    <PageContainer title="Sessions actives">
      <Breadcrumb items={BCrumb} />
      <Admin_Sessions />
    </PageContainer>
  );
};

export default Admin_Sessions_Page;
