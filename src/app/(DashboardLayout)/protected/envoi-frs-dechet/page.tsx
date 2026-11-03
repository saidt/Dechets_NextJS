import PageContainer from "@/components/container/PageContainer";
import Envoi_Frs_Dechet_List from "@/ui/envoi-frs-dechet/Envoi_Frs_Dechet_List";
import { ENVOI_FRS_DECHET_LIST_TITLE } from '@/types/envoi-frs-dechet';
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
	{ title: ENVOI_FRS_DECHET_LIST_TITLE },
];

const Envoi_Frs_Dechet_List_Page = () => {
  return (
    <PageContainer title={ ENVOI_FRS_DECHET_LIST_TITLE }>
      <Breadcrumb items={breadcrumbItems} />
      <Envoi_Frs_Dechet_List isModalList={false} />
    </PageContainer>
  );
};

export default Envoi_Frs_Dechet_List_Page;