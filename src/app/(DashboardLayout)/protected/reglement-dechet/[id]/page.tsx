'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Reglement_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import Reglement_Dechet_Show from '@/ui/reglement-dechet/Reglement_Dechet_Show';

export default async function Reglement_DechetPage() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Reglement_Dechet_Breadcrumb,
    {title: 'Reglement déchets'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Reglement_Dechet_Show />
    </main>
  );
};