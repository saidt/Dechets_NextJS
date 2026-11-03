import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb";
import ProfilePage from "@/ui/user-profile/ProfilePage";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "User profile",
  },
];

const User_Profile = async () => {
  return (
    <PageContainer title="Profile">
      <Breadcrumb items={BCrumb} />
        <ProfilePage />
    </PageContainer>
  );
};

export default User_Profile;