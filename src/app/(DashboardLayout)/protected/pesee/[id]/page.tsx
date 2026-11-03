'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Pesee_Breadcrumb } from '@/lib/breadcrumb-items';
import { PESEE_SHOW_TITLE } from '@/types/pesee';
import Pesee_Show from '@/ui/pesee/Pesee_Show';

export default async function Pesee_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Pesee_Breadcrumb,
    { title: PESEE_SHOW_TITLE },
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Pesee_Show />
    </main>
  );
};