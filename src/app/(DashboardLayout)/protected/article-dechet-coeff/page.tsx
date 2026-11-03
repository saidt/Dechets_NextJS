import PageContainer from "@/components/container/PageContainer";
import { Home_Breadcrumb } from "@/lib/breadcrumb-items";
import Breadcrumb from "../../shared/breadcrumb/Breadcrumb";
import Article_Dechet_Coeff_List from "@/ui/article-dechet-coeff/Article_Dechet_Coeff_List";

const breadcrumbItems = [
  Home_Breadcrumb,
  { title: "Coéfficients des articles déchets" }
];

const Article_Dechet_Coeff_List_Page = () => {
  return (
    <PageContainer title="Coéfficients des articles déchets">
      <Breadcrumb items={breadcrumbItems} />
      <Article_Dechet_Coeff_List isModalList={false} />
    </PageContainer>
  );
};

export default Article_Dechet_Coeff_List_Page;