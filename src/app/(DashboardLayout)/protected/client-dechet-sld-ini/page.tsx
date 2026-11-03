import PageContainer from "@/components/container/PageContainer";
import Client_Dechet_Sld_Ini_List from "@/ui/client-dechet-sld-ini/Client_Dechet_Sld_Ini_List";
import { CLIENT_DECHET_SLD_INI_LIST_TITLE } from '@/types/client-dechet-sld-ini';
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
	{ title: CLIENT_DECHET_SLD_INI_LIST_TITLE },
];

const Client_Dechet_Sld_Ini_List_Page = () => {
  return (
    <PageContainer title={ CLIENT_DECHET_SLD_INI_LIST_TITLE }>
      <Breadcrumb items={breadcrumbItems} />
      <Client_Dechet_Sld_Ini_List isModalList={false} />
    </PageContainer>
  );
};

export default Client_Dechet_Sld_Ini_List_Page;