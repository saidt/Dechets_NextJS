import PageContainer from "@/components/container/PageContainer";
import Retour_Dechet_List from "@/ui/retour-dechet/Retour_Dechet_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Retours déchets" }
];

const Retour_Dechet_List_Page = () => {
  return (
    <PageContainer title="Retours déchets">
      <Breadcrumb items={breadcrumbItems} />
      <Retour_Dechet_List isModalList={false} />
    </PageContainer>
  );
};

export default Retour_Dechet_List_Page;