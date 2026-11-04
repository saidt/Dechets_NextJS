import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";
import Password_Hash from "@/ui/password-hash/Password_Hash";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Hash mot de passe",
  },
];

const Password_Hash_Page = () => {
  return (
    <PageContainer title="Hash de mot de passe">
      <Breadcrumb items={BCrumb} />
      <Password_Hash />
    </PageContainer>
  );
};

export default Password_Hash_Page;
