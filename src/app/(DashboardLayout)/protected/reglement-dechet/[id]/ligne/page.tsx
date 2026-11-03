import PageContainer from "@/components/container/PageContainer";
import Reglement_Dechet_Ligne_List from "@/ui/reglement-dechet/Reglement_Dechet_Ligne_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Réglement déchets lignes" }
];

const Reglement_Dechet_Ligne_List_Page = () => {
  return (
    <PageContainer title="Reglement_Dechet_Lignes">
      <Breadcrumb items={breadcrumbItems} />
      <Reglement_Dechet_Ligne_List isModalList={false} />
    </PageContainer>
  );
};

export default Reglement_Dechet_Ligne_List_Page;