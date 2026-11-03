import PageContainer from "@/components/container/PageContainer";
import Sortie_Dechet_List from "@/ui/sortie-dechet/Sortie_Dechet_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Sorties déchets" }
];

const Sortie_Dechet_List_Page = () => {
  return (
    <PageContainer title="Sorties déchets">
      <Breadcrumb items={breadcrumbItems} />
      <Sortie_Dechet_List isModalList={false} />
    </PageContainer>
  );
};

export default Sortie_Dechet_List_Page;