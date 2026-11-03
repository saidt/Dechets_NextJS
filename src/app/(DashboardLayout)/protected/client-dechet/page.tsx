import PageContainer from "@/components/container/PageContainer";
import Client_Dechet_List from "@/ui/client-dechet/Client_Dechet_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Clients déchets" }
];

const Client_Dechet_List_Page = () => {
  return (
    <PageContainer title="Clients déchets">
      <Breadcrumb items={breadcrumbItems} />
      <Client_Dechet_List isModalList={false} />
    </PageContainer>
  );
};

export default Client_Dechet_List_Page;