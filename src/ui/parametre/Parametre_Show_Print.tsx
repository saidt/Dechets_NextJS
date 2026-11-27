import { ReportDetail, ReportLayout, ReportList } from '@/components/pdf/ReportComponent';
import { downloadPdf } from '@/components/pdf/pdfService';
import { MAX_ALL_DATA_SIZE } from '@/lib/consts';
import { fetchChildForPrint } from '@/components/pdf/printChild';
import { TableState } from '@/lib/types';
import { parametre_Columns, PARAMETRE_FETCH_URL, Parametre_Type } from '@/types/parametre';
import { PARAMETRE_LIGNE_CHILD_URL, parametre_Ligne_Columns, Parametre_Ligne_Type, PARAMETRE_LIGNE_TABLE_NAME } from '@/types/parametre-ligne';

export async function Parametre_Show_Print(
  data: Parametre_Type,
  userId: string | undefined,
  hasRole: (role: string) => boolean,
): Promise<void> {

  const title = 'Paramètres'
  const parametre_Ligne_TableState: TableState<Parametre_Ligne_Type> = {
    page: 0,
    pageSize: MAX_ALL_DATA_SIZE,
    sort: { field: 'code', direction: 'asc' },
    filter: { parametre_rubrique: String(data.rubrique) },
    quickSearch: ''
  }
// null without the child table's LIST role: the list is left out
  const parametre_Ligne_Data = await fetchChildForPrint<Parametre_Ligne_Type>(hasRole, PARAMETRE_LIGNE_TABLE_NAME, `${ PARAMETRE_FETCH_URL}/${data.rubrique}/${ PARAMETRE_LIGNE_CHILD_URL}`, parametre_Ligne_TableState);

  const parametre_Ligne_Print_Columns = parametre_Ligne_Columns.filter(
    col => col.meta.printed 
  );

  const doc = (
    <ReportLayout title={title} userId={userId}>
      <ReportDetail columns={ parametre_Columns} data={data} />
      {parametre_Ligne_Data && <ReportList columns={ parametre_Ligne_Print_Columns } data={ parametre_Ligne_Data } />}
    </ReportLayout>
  );

  await downloadPdf(doc, `${title}.pdf`);
}