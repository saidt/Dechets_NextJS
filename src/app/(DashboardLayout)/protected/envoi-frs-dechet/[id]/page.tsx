import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Envoi_Frs_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import { ENVOI_FRS_DECHET_SHOW_TITLE } from '@/types/envoi-frs-dechet';
import Envoi_Frs_Dechet_Show from '@/ui/envoi-frs-dechet/Envoi_Frs_Dechet_Show';

export default async function Envoi_Frs_Dechet_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Envoi_Frs_Dechet_Breadcrumb,
    { title: ENVOI_FRS_DECHET_SHOW_TITLE },
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Envoi_Frs_Dechet_Show />
    </main>
  );
};