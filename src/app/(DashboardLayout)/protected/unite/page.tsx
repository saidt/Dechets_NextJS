import PageContainer from "@/components/container/PageContainer";
import Unite_List from "@/ui/unite/Unite_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Unites" }
];

const Unite_List_Page = () => {
  return (
    <PageContainer title="Unités">
      <Breadcrumb items={breadcrumbItems} />
      <Unite_List isModalList={false} />
    </PageContainer>
  );
};

export default Unite_List_Page;