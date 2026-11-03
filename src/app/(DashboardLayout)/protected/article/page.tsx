import PageContainer from "@/components/container/PageContainer";
import Article_List from "@/ui/article/Article_List";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Articles" }
];

const Article_List_Page = () => {
  return (
    <PageContainer title="Articles">
      <Breadcrumb items={breadcrumbItems} />
      <Article_List isModalList={false} />
    </PageContainer>
  );
};

export default Article_List_Page;