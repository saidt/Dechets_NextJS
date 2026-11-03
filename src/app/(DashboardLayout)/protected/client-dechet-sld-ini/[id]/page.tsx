'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Client_Dechet_Sld_Ini_Breadcrumb } from '@/lib/breadcrumb-items';
import { CLIENT_DECHET_SLD_INI_SHOW_TITLE } from '@/types/client-dechet-sld-ini';
import Client_Dechet_Sld_Ini_Show from '@/ui/client-dechet-sld-ini/Client_Dechet_Sld_Ini_Show';

export default async function Client_Dechet_Sld_Ini_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Client_Dechet_Sld_Ini_Breadcrumb,
    { title: CLIENT_DECHET_SLD_INI_SHOW_TITLE },
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Client_Dechet_Sld_Ini_Show />
    </main>
  );
};