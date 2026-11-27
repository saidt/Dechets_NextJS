import { ReportDetail, ReportLayout, ReportList } from '@/components/pdf/ReportComponent';
import { downloadPdf } from '@/components/pdf/pdfService';
import { MAX_ALL_DATA_SIZE } from '@/lib/consts';
import { fetchChildForPrint } from '@/components/pdf/printChild';
import { TableState } from '@/lib/types';
import { reglement_Dechet_Columns, REGLEMENT_DECHET_FETCH_URL, Reglement_Dechet_Type } from '@/types/reglement-dechet';
import { REGLEMENT_DECHET_LIGNE_CHILD_URL, reglement_Dechet_Ligne_Columns, Reglement_Dechet_Ligne_Type, REGLEMENT_DECHET_LIGNE_TABLE_NAME } from '@/types/reglement-dechet-ligne';

export async function Reglement_Dechet_Show_Print(
  data: Reglement_Dechet_Type,
  userId: string | undefined,
  hasRole: (role: string) => boolean,
): Promise<void> {

  const title = 'Réglement déchets'
  const reglement_Dechet_Ligne_TableState: TableState<Reglement_Dechet_Ligne_Type> = {
    page: 0,
    pageSize: MAX_ALL_DATA_SIZE,
    sort: { field: 'sortie_dechet_numero', direction: 'asc' }, 
    filter: { reglement_dechet_numero: String(data.numero) },
    quickSearch: ''
  }
// null without the child table's LIST role: the list is left out
  const reglement_Dechet_Ligne_Data = await fetchChildForPrint<Reglement_Dechet_Ligne_Type>(hasRole, REGLEMENT_DECHET_LIGNE_TABLE_NAME, `${ REGLEMENT_DECHET_FETCH_URL}/${data.numero}/${ REGLEMENT_DECHET_LIGNE_CHILD_URL}`, reglement_Dechet_Ligne_TableState);

  const reglement_Dechet_Ligne_Print_Columns = reglement_Dechet_Ligne_Columns.filter(
    col => col.meta.printed
  );

  const doc = (
    <ReportLayout title={title} userId={userId}>
      <ReportDetail columns={ reglement_Dechet_Columns} data={data} />
      {reglement_Dechet_Ligne_Data && <ReportList columns={ reglement_Dechet_Ligne_Print_Columns } data={ reglement_Dechet_Ligne_Data } />}
    </ReportLayout>
  );

  await downloadPdf(doc, `${title}.pdf`);
}