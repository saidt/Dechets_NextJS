import PageContainer from "@/components/container/PageContainer";
import Unite_Conversion_List from "@/ui/unite-conversion/Unite_Conversion_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Conversions d'unités" }
];

const Unite_Conversion_List_Page = () => {
  return (
    <PageContainer title="Unite_Conversions">
      <Breadcrumb items={breadcrumbItems} />
      <Unite_Conversion_List isModalList={false} />
    </PageContainer>
  );
};

export default Unite_Conversion_List_Page;