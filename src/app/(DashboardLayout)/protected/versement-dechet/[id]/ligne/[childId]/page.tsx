import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Versement_Dechet_Breadcrumb } from '@/lib/breadcrumb-items'; 
import { VERSEMENT_DECHET_URL } from '@/types/versement-dechet';
import Versement_Dechet_Ligne_Show from '@/ui/versement-dechet/Versement_Dechet_Ligne_Show';

export default async function Versement_Dechet_Ligne_Show_Page({ params } :{ params: Promise<{ id: string; childId: string }> }) {
	const { id } = await params;
	
  const breadcrumbItems = [
    Home_Breadcrumb,
    Versement_Dechet_Breadcrumb,
		{ title: 'Versement déchets', to: `${ VERSEMENT_DECHET_URL }/${id}` }, 
    { title: 'Versement déchets ligne'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Versement_Dechet_Ligne_Show />
    </main>
  );
};