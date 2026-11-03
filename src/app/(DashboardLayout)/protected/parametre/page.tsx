import PageContainer from "@/components/container/PageContainer";
import Parametre_List from "@/ui/parametre/Parametre_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Paramètres" }
];

const Parametre_List_Page = () => {
  return (
    <PageContainer title="Paramètres tables">
      <Breadcrumb items={breadcrumbItems} />
      <Parametre_List isModalList={false} />
    </PageContainer>
  );
};

export default Parametre_List_Page;