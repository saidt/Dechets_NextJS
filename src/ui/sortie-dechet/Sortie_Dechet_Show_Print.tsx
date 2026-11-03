import { ReportDetail, ReportLayout, ReportList } from '@/components/pdf/ReportComponent';
import { downloadPdf } from '@/components/pdf/pdfService';
import { MAX_ALL_DATA_SIZE } from '@/lib/consts';
import { fetchAllData } from '@/lib/fetchData';
import { TableState } from '@/lib/types';
import { sortie_Dechet_Columns, SORTIE_DECHET_FETCH_URL, Sortie_Dechet_Type } from '@/types/sortie-dechet';
import { SORTIE_DECHET_DETAIL_CHILD_URL, sortie_Dechet_Detail_Columns, Sortie_Dechet_Detail_Type } from '@/types/sortie-dechet-detail';
import { SORTIE_DECHET_LIGNE_CHILD_URL, sortie_Dechet_Ligne_Columns, Sortie_Dechet_Ligne_Type } from '@/types/sortie-dechet-ligne';

export async function sortie_Dechet_Show_Print(
  data: Sortie_Dechet_Type,
  userId?: string,
): Promise<void> {

  const title = 'Sortie déchets'

  const lignesTableState: TableState<Sortie_Dechet_Ligne_Type> = {
    page: 0,
    pageSize: MAX_ALL_DATA_SIZE,
    sort: { field: 'ligne_numero', direction: 'asc' },
    filter: { sortie_dechet_numero: String(data.numero) },
    quickSearch: ''
  }
  const lignesResponse = await fetchAllData<Sortie_Dechet_Ligne_Type>(`${SORTIE_DECHET_FETCH_URL}/${data.numero}/${SORTIE_DECHET_LIGNE_CHILD_URL}`, lignesTableState);
  const lignesJson = await lignesResponse.json();
  const lignesData = lignesJson.data;    

  const detailsTableState: TableState<Sortie_Dechet_Detail_Type> = {
    page: 0,
    pageSize: MAX_ALL_DATA_SIZE,
    sort: { field: 'ligne_numero', direction: 'asc' },
    filter: { sortie_dechet_numero: String(data.numero) },
    quickSearch: ''
  }
  const detailsResponse = await fetchAllData<Sortie_Dechet_Detail_Type>(`${SORTIE_DECHET_FETCH_URL}/${data.numero}/${SORTIE_DECHET_DETAIL_CHILD_URL}`, detailsTableState);
  const detailsJson = await detailsResponse.json();
  const detailsData = detailsJson.data;    

  const lignesColumns = sortie_Dechet_Ligne_Columns.filter(
    col => col.accessor !== "id"
  );

  const detailColumns = sortie_Dechet_Detail_Columns.filter(
    col => col.accessor !== "id"
  );

  const doc = (
    <ReportLayout title={title} userId={userId}>
      <ReportDetail columns={sortie_Dechet_Columns} data={data} />
      <ReportList columns={lignesColumns} data={lignesData} />
      <ReportList columns={detailColumns} data={detailsData} />
    </ReportLayout>
  );

  await downloadPdf(doc, `${title}.pdf`);
}