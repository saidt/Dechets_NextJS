import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Versement_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import Versement_Dechet_Show from '@/ui/versement-dechet/Versement_Dechet_Show';

export default async function Versement_Dechet_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Versement_Dechet_Breadcrumb,
    { title: 'Versement déchets'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Versement_Dechet_Show />
    </main>
  );
};