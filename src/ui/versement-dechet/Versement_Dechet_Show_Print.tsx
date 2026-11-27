import { ReportDetail, ReportLayout, ReportList } from '@/components/pdf/ReportComponent';
import { downloadPdf } from '@/components/pdf/pdfService';
import { MAX_ALL_DATA_SIZE } from '@/lib/consts';
import { fetchAllData } from '@/lib/fetchData';
import { TableState } from '@/lib/types';
import { versement_Dechet_Columns, VERSEMENT_DECHET_FETCH_URL, Versement_Dechet_Type } from '@/types/versement-dechet';
import { VERSEMENT_DECHET_LIGNE_CHILD_URL, versement_Dechet_Ligne_Columns, Versement_Dechet_Ligne_Type } from '@/types/versement-dechet-ligne';

export async function Versement_Dechet_Show_Print(
  data: Versement_Dechet_Type,
  userId?: string,
): Promise<void> {

  const title = 'Versement déchets'
  const versement_Dechet_Ligne_TableState: TableState<Versement_Dechet_Ligne_Type> = {
    page: 0,
    pageSize: MAX_ALL_DATA_SIZE,
    sort: { field: 'reglement_dechet_numero', direction: 'asc' },
    filter: { versement_dechet_numero: String(data.numero) }, 
    quickSearch: ''
  }

  const versement_Dechet_Ligne_Response = await fetchAllData<Versement_Dechet_Ligne_Type>(`${VERSEMENT_DECHET_FETCH_URL}/${data.numero}/${VERSEMENT_DECHET_LIGNE_CHILD_URL}`, versement_Dechet_Ligne_TableState);
  const versement_Dechet_Ligne_Json = await versement_Dechet_Ligne_Response.json();
  const versement_Dechet_Ligne_Data = versement_Dechet_Ligne_Json.data;    

  const versement_Dechet_Ligne_Print_Columns = versement_Dechet_Ligne_Columns.filter(
    col => col.meta.printed
  );

  const doc = (
    <ReportLayout title={title} userId={userId}>
      <ReportDetail columns={ versement_Dechet_Columns} data={data} />
      <ReportList columns={ versement_Dechet_Ligne_Print_Columns } data={ versement_Dechet_Ligne_Data } />
    </ReportLayout>
  );

  await downloadPdf(doc, `${title}.pdf`);
}