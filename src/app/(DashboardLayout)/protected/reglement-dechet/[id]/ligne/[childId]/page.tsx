import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Reglement_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import { REGLEMENT_DECHET_URL } from '@/types/reglement-dechet';
import Reglement_Dechet_Ligne_Show from '@/ui/reglement-dechet/Reglement_Dechet_Ligne_Show';

export default async function Reglement_Dechet_Ligne_Show_Page({ params } :{ params: Promise<{ id: string; childId: string }> }) {
	const { id } = await params;
	
  const breadcrumbItems = [
    Home_Breadcrumb,
    Reglement_Dechet_Breadcrumb, 
		{ title: 'Réglement déchets', to: `${REGLEMENT_DECHET_URL}/${id}` },
    { title: 'Réglement déchets ligne' },
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Reglement_Dechet_Ligne_Show />
    </main>
  );
};