import PageContainer from "@/components/container/PageContainer";
import Reglement_Dechet_List from "@/ui/reglement-dechet/Reglement_Dechet_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Réglement déchets" }
];

const Reglement_Dechet_List_Page = () => {
  return (
    <PageContainer title="Réglement déchets">
      <Breadcrumb items={breadcrumbItems} />
      <Reglement_Dechet_List isModalList={false} />
    </PageContainer>
  );
};

export default Reglement_Dechet_List_Page;