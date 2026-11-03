import { ARTICLE_LIST_TITLE, ARTICLE_URL } from "@/types/article"
import { ARTICLE_DECHET_COEFF_LIST_TITLE, ARTICLE_DECHET_COEFF_URL } from "@/types/article-dechet-coeff"
import { CLIENT_DECHET_LIST_TITLE, CLIENT_DECHET_URL } from "@/types/client-dechet"
import { CLIENT_DECHET_SLD_INI_LIST_TITLE, CLIENT_DECHET_SLD_INI_URL } from "@/types/client-dechet-sld-ini"
import { ENVOI_FRS_DECHET_LIST_TITLE, ENVOI_FRS_DECHET_URL } from "@/types/envoi-frs-dechet"
import { PARAMETRE_LIST_TITLE, PARAMETRE_URL } from "@/types/parametre"
import { PARAMETRE_LIGNE_LIST_TITLE, PARAMETRE_LIGNE_URL } from "@/types/parametre-ligne"
import { PERIODE_LIST_TITLE, PERIODE_URL } from "@/types/periode"
import { PESEE_LIST_TITLE, PESEE_URL } from "@/types/pesee"
import { REGLEMENT_DECHET_LIST_TITLE, REGLEMENT_DECHET_URL } from "@/types/reglement-dechet"
import { RETOUR_DECHET_LIST_TITLE, RETOUR_DECHET_URL } from "@/types/retour-dechet"
import { SORTIE_DECHET_LIST_TITLE, SORTIE_DECHET_URL } from "@/types/sortie-dechet"
import { UNITE_LIST_TITLE, UNITE_URL } from "@/types/unite"
import { UNITE_CONVERSION_LIST_TITLE, UNITE_CONVERSION_URL } from "@/types/unite-conversion"
import { VERSEMENT_DECHET_LIST_TITLE, VERSEMENT_DECHET_URL } from "@/types/versement-dechet"

export const Home_Breadcrumb = { title: 'Home', to: '/' }
export const Dashboard_Breadcrumb = { title: 'Tableau de board', to: '/protected/dashboard' }
export const Profile_Breadcrumb = { title: 'Profile', to: '/protected/profile' }
export const Unite_Breadcrumb = { title: UNITE_LIST_TITLE, to: UNITE_URL }
export const Unite_Conversion_Breadcrumb = { title:UNITE_CONVERSION_LIST_TITLE, to: UNITE_CONVERSION_URL }
export const Client_Dechet_Breadcrumb = { title: CLIENT_DECHET_LIST_TITLE, to: CLIENT_DECHET_URL }
export const Article_Dechet_Breadcrumb = { title: ARTICLE_LIST_TITLE, to: ARTICLE_URL }
export const Parametre_Breadcrumb = { title: PARAMETRE_LIST_TITLE, to: PARAMETRE_URL }
export const Parametre_Ligne_Breadcrumb = { title: PARAMETRE_LIGNE_LIST_TITLE, to: PARAMETRE_LIGNE_URL }
export const Article_Dechet_Coeff_Breadcrumb = { title: ARTICLE_DECHET_COEFF_LIST_TITLE, to: ARTICLE_DECHET_COEFF_URL }
export const Sortie_Dechet_Breadcrumb = { title: SORTIE_DECHET_LIST_TITLE, to: SORTIE_DECHET_URL }
export const Retour_Dechet_Breadcrumb = { title: RETOUR_DECHET_LIST_TITLE, to: RETOUR_DECHET_URL }
export const Periode_Breadcrumb = { title: PERIODE_LIST_TITLE, to: PERIODE_URL }
export const Reglement_Dechet_Breadcrumb = { title: REGLEMENT_DECHET_LIST_TITLE, to: REGLEMENT_DECHET_URL }
export const Versement_Dechet_Breadcrumb = { title: VERSEMENT_DECHET_LIST_TITLE, to: VERSEMENT_DECHET_URL }
export const Client_Dechet_Sld_Ini_Breadcrumb = { title: CLIENT_DECHET_SLD_INI_LIST_TITLE, to: CLIENT_DECHET_SLD_INI_URL }
export const Envoi_Frs_Dechet_Breadcrumb = { title: ENVOI_FRS_DECHET_LIST_TITLE, to: ENVOI_FRS_DECHET_URL }
export const Pesee_Breadcrumb = { title: PESEE_LIST_TITLE, to: PESEE_URL }
