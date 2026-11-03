import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Article_Dechet_Coeff_Breadcrumb } from '@/lib/breadcrumb-items';
import Article_Dechet_Coeff_Show from '@/ui/article-dechet-coeff/Article_Dechet_Coeff_Show';

export default async function Article_Dechet_CoeffPage() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Article_Dechet_Coeff_Breadcrumb,
    { title: 'Coéfficient article déchets'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Article_Dechet_Coeff_Show />
    </main>
  );
};