import { ReportLayout, ReportList } from '@/components/pdf/ReportComponent';
import { downloadPdf } from '@/components/pdf/pdfService';
import { sortie_Dechet_Columns, Sortie_Dechet_Type } from '@/types/sortie-dechet';

const keys = [
  "numero",
  "client_code",
  "client_raison_sociale",
  "date_piece",
  "montant",
  "valide",
];

const sortie_Dechet_List_Columns =
  sortie_Dechet_Columns.filter(col =>
    keys.includes(col.accessor as string)
  );

export async function sortie_Dechet_List_Print(
  data: Sortie_Dechet_Type[],
  userId?: string
): Promise<void> {
  
  const title = 'Sorties déchets'
  
  const doc = (
    <ReportLayout title={title} userId={userId}>
      <ReportList columns={sortie_Dechet_List_Columns} data={data} />
    </ReportLayout>
  );
  await downloadPdf(doc, `${title}.pdf`);
}