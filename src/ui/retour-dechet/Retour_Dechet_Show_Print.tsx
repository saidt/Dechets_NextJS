import { ReportDetail, ReportLayout, ReportList } from '@/components/pdf/ReportComponent';
import { downloadPdf } from '@/components/pdf/pdfService';
import { MAX_ALL_DATA_SIZE } from '@/lib/consts';
import { fetchChildForPrint } from '@/components/pdf/printChild';
import { TableState } from '@/lib/types';
import { retour_Dechet_Columns, RETOUR_DECHET_FETCH_URL, Retour_Dechet_Type } from '@/types/retour-dechet';
import { RETOUR_DECHET_LIGNE_CHILD_URL, retour_Dechet_Ligne_Columns, Retour_Dechet_Ligne_Type, RETOUR_DECHET_LIGNE_TABLE_NAME } from '@/types/retour-dechet-ligne';

export async function Retour_Dechet_Show_Print(
  data: Retour_Dechet_Type,
  userId: string | undefined,
  hasRole: (role: string) => boolean,
): Promise<void> {

  const title = ' Retour déchets'
  const retour_Dechet_Ligne_TableState: TableState<Retour_Dechet_Ligne_Type> = {
    page: 0,
    pageSize: MAX_ALL_DATA_SIZE,
    sort: { field: 'ligne_numero', direction: 'asc' },
    filter: { retour_dechet_numero: String(data.numero) },
    quickSearch: ''
  }
// null without the child table's LIST role: the list is left out
  const retour_Dechet_Ligne_Data = await fetchChildForPrint<Retour_Dechet_Ligne_Type>(hasRole, RETOUR_DECHET_LIGNE_TABLE_NAME, `${ RETOUR_DECHET_FETCH_URL}/${data.numero}/${ RETOUR_DECHET_LIGNE_CHILD_URL}`, retour_Dechet_Ligne_TableState);

  const retour_Dechet_Ligne_Print_Columns = retour_Dechet_Ligne_Columns.filter(
    col => col.meta.printed
  );

  const doc = (
    <ReportLayout title={title} userId={userId}>
      <ReportDetail columns={ retour_Dechet_Columns} data={data} />
      {retour_Dechet_Ligne_Data && <ReportList columns={ retour_Dechet_Ligne_Print_Columns } data={ retour_Dechet_Ligne_Data } />}
    </ReportLayout>
  );

  await downloadPdf(doc, `${title}.pdf`);
}