'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Periode_Breadcrumb } from '@/lib/breadcrumb-items';
import Periode_Show from '@/ui/periode/Periode_Show';

export default async function PeriodePage() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Periode_Breadcrumb,
    { title: 'Période'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Periode_Show />
    </main>
  );
};