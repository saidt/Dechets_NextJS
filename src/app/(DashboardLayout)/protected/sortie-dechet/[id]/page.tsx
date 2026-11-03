'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Sortie_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import Sortie_Dechet_Show from '@/ui/sortie-dechet/Sortie_Dechet_Show';

export default async function Sortie_Dechet_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Sortie_Dechet_Breadcrumb,
    { title: 'Sortie déchets' },
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Sortie_Dechet_Show />
    </main>
  );
};