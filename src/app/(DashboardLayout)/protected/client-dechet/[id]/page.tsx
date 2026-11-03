import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Client_Dechet_Breadcrumb } from '@/lib/breadcrumb-items';
import Client_Dechet_Show from '@/ui/client-dechet/Client_Dechet_Show';

export default async function Client_Dechet_Show_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Client_Dechet_Breadcrumb,
    {title: 'Client déchets'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Client_Dechet_Show />
    </main>
  );
};