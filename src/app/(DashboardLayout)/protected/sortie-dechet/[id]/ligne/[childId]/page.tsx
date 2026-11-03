'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Sortie_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import { SORTIE_DECHET_URL } from '@/types/sortie-dechet';
import Sortie_Dechet_Ligne_Show from '@/ui/sortie-dechet/Sortie_Dechet_Ligne_Show';

export default async function Sortie_Dechet_Ligne_Show_Page({ params } :{ params: Promise<{ id: string; childId: string }> }) {
	const { id } = await params;
	
  const breadcrumbItems = [
    Home_Breadcrumb,
    Sortie_Dechet_Breadcrumb,
		{ title: 'Sortie déchets', to: `${SORTIE_DECHET_URL}/${id}` },
    { title: 'Ligne sortie déchets'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Sortie_Dechet_Ligne_Show />
    </main>
  );
};