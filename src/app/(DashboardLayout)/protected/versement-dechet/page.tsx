import PageContainer from "@/components/container/PageContainer";
import Versement_Dechet_List from "@/ui/versement-dechet/Versement_Dechet_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Versement déchets" }
];

const Versement_Dechet_List_Page = () => {
  return (
    <PageContainer title="Versements déchets">
      <Breadcrumb items={breadcrumbItems} />
      <Versement_Dechet_List isModalList={false} />
    </PageContainer>
  );
};

export default Versement_Dechet_List_Page;