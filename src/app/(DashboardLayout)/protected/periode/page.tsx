import PageContainer from "@/components/container/PageContainer";
import Periode_List from "@/ui/periode/Periode_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Périodes" }
];

const Periode_List_Page = () => {
  return (
    <PageContainer title="Périodes">
      <Breadcrumb items={breadcrumbItems} />
      <Periode_List isModalList={false} />
    </PageContainer>
  );
};

export default Periode_List_Page;