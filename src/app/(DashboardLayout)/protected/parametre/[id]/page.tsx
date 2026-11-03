import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Parametre_Breadcrumb } from '@/lib/breadcrumb-items';
import Parametre_Show from '@/ui/parametre/Parametre_Show';

export default async function Parametre_Show_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Parametre_Breadcrumb,
    { title: 'Parametre'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Parametre_Show />
    </main>
  );
};