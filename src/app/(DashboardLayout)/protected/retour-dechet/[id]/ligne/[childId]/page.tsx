'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Retour_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import { RETOUR_DECHET_URL } from '@/types/retour-dechet';
import Retour_Dechet_Ligne_Show from '@/ui/retour-dechet/Retour_Dechet_Ligne_Show';

export default async function Retour_Dechet_Ligne_Show_Page({ params } :{ params: Promise<{ id: string; childId: string }> }) {
	const { id } = await params;
	
  const breadcrumbItems = [
    Home_Breadcrumb,
    Retour_Dechet_Breadcrumb,
		{ title: 'Retour déchets', to: `${RETOUR_DECHET_URL}/${id}` },
    { title: 'Ligne retour déchets' },
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Retour_Dechet_Ligne_Show />
    </main>
  );
};