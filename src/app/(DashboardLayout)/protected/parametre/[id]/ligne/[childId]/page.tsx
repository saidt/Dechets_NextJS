import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Parametre_Ligne_Breadcrumb } from '@/lib/breadcrumb-items';
import { PARAMETRE_URL } from '@/types/parametre';
import Parametre_Ligne_Show from '@/ui/parametre/Parametre_Ligne_Show';

export default async function Parametre_Ligne_Show_Page({ params } :{ params: Promise<{ id: string; childId: string }> }) {
	const { id } = await params;
  //consoleInfo('Parametre_Ligne_Show_Page masterId: ', id);
  //consoleInfo('Parametre_Ligne_Show_Page childId: ', childId);
	
  const breadcrumbItems = [
    Home_Breadcrumb,
    Parametre_Ligne_Breadcrumb,
		{ title: 'Paramètre', to: `${ PARAMETRE_URL }/${id}` },
    { title: 'Paramètre ligne'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Parametre_Ligne_Show />
    </main>
  );
};