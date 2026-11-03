'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Retour_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import Retour_Dechet_Show from '@/ui/retour-dechet/Retour_Dechet_Show';

export default async function Retour_DechetPage() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Retour_Dechet_Breadcrumb,
    { title: 'Retour déchets'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Retour_Dechet_Show />
    </main>
  );
};