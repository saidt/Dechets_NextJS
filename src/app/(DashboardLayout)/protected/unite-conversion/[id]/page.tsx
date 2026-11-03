import Breadcrumb from '@/app/(DashboardLayout)/shared/breadcrumb/Breadcrumb';
import { Home_Breadcrumb, Unite_Conversion_Breadcrumb } from '@/lib/breadcrumb-items';
import Unite_Conversion_Show from '@/ui/unite-conversion/Unite_Conversion_Show';

export default async function Unite_Conversion_Page() {

  const breadcrumbItems = [
    Home_Breadcrumb,
    Unite_Conversion_Breadcrumb,
    { title: "Conversion d'unités détail"},
  ];

  return (
    <main>
      <Breadcrumb items={breadcrumbItems} />
      <Unite_Conversion_Show />
    </main>
  );
};