import PageContainer from "@/components/container/PageContainer";
import Pesee_List from "@/ui/pesee/Pesee_List";
import { PESEE_LIST_TITLE } from '@/types/pesee';
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
	{ title: PESEE_LIST_TITLE },
];

const Pesee_List_Page = () => {
  return (
    <PageContainer title={ PESEE_LIST_TITLE }>
      <Breadcrumb items={breadcrumbItems} />
      <Pesee_List isModalList={false} />
    </PageContainer>
  );
};

export default Pesee_List_Page;