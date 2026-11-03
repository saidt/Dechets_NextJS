'use server'

import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Unite_Breadcrumb } from '@/lib/breadcrumb-items';
import Unite_Show from '@/ui/unite/Unite_Show';

export default async function Unite_Show_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Unite_Breadcrumb,
    { title: 'Unité'},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Unite_Show />
    </main>
  );
};