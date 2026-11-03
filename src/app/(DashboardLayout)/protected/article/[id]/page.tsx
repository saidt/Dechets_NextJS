import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Article_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import Article_Show from '@/ui/article/Article_Show';

export default async function Article_Show_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Article_Dechet_Breadcrumb,
    { title: 'Article'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Article_Show />
    </main>
  );
};