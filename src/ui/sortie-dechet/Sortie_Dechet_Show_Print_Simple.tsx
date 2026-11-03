import { ReportDetail, ReportLayout, ReportList } from '@/components/pdf/ReportComponent';
import { downloadPdf } from '@/components/pdf/pdfService';
import { MAX_ALL_DATA_SIZE } from '@/lib/consts';
import { fetchAllData } from '@/lib/fetchData';
import { TableState } from '@/lib/types';
import {
  sortie_Dechet_Columns,
  SORTIE_DECHET_FETCH_URL,
  Sortie_Dechet_Type,
} from "@/types/sortie-dechet";
import {
  SORTIE_DECHET_LIGNE_CHILD_URL,
  sortie_Dechet_Ligne_Columns,
  Sortie_Dechet_Ligne_Type,
} from "@/types/sortie-dechet-ligne";

export async function sortie_Dechet_Show_Print_Simple(
  data: Sortie_Dechet_Type,
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

  const sortieAccessors = ['numero', 'date_piece'] as (keyof Sortie_Dechet_Type)[];

  const sortieColumns = sortie_Dechet_Columns.filter(col =>
    sortieAccessors.includes(col.accessor)
  );

  const ligneAccessors = ['article_code', 'article_designation', 'unite', 'quantite'] as (keyof Sortie_Dechet_Ligne_Type)[];

  const ligneColumns = sortie_Dechet_Ligne_Columns.filter(col =>
    ligneAccessors.includes(col.accessor)
  );

  const doc = (
    <ReportLayout title={title} userId={''}>
      <ReportDetail columns={sortieColumns} data={data} />
      <ReportList columns={ligneColumns} data={lignesData} />
    </ReportLayout>
  );

  await downloadPdf(doc, `${title}.pdf`);
}