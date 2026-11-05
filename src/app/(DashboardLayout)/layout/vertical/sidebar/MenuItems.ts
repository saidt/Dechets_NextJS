import { uniqueId } from "@/lib/lib";
import { NavItem_Type } from "./NavGroup";
import { USER_PROFILE_URL } from "@/types/user-profile";
import { PASSWORD_HASH_URL } from "@/types/user";
import { ADMIN_SESSIONS_URL } from "@/types/admin-session";
import { UNITE_URL } from "@/types/unite";
import { CLIENT_DECHET_URL } from "@/types/client-dechet";
import { ARTICLE_URL } from "@/types/article";
import { PARAMETRE_URL } from "@/types/parametre";
import { ARTICLE_DECHET_COEFF_URL } from "@/types/article-dechet-coeff";
import { SORTIE_DECHET_URL } from "@/types/sortie-dechet";
import { PERIODE_URL } from "@/types/periode";
import { RETOUR_DECHET_URL } from "@/types/retour-dechet";
import { REGLEMENT_DECHET_URL } from "@/types/reglement-dechet";
import { VERSEMENT_DECHET_URL } from "@/types/versement-dechet";
import { CLIENT_DECHET_SLD_INI_URL } from "@/types/client-dechet-sld-ini";
import { ENVOI_FRS_DECHET_URL } from "@/types/envoi-frs-dechet";
import { PESEE_URL } from "@/types/pesee";

const Menuitems: NavItem_Type[] = [
  {
    id: uniqueId(),
    title: "Tableau de board",
    icon: "material-symbols:dashboard",
    href: "/protected/dashboard",
  },
  {
    navlabel: true,
    subheader: "Base",
  },
  {
    id: uniqueId(),
    title: "Clients déchets",
    icon: "carbon:customer",
    href: CLIENT_DECHET_URL,
  },
  {
    id: uniqueId(),
    title: "Articles déchets",
    icon: "hugeicons:group-items",
    href: ARTICLE_URL,
  },
  {
    id: uniqueId(),
    title: "Unités",
    icon: "solar:bill-list-linear",
    href: "",
    children: [
      {
        id: uniqueId(),
        title: "Unités",
        icon: "ph:unite-square",
        href: UNITE_URL,
      },
      {
        id: uniqueId(),
        title: "Conversion d'unités",
        icon: "streamline-plump:convert-pdf-1-solid",
        href: "/protected/unite-conversion",
      },
    ],
  },
  {
    navlabel: true,
    subheader: "Mouvements",
  },
  {
    id: uniqueId(),
    title: "Sorties déchets",
    icon: "mdi:logout",
    href: SORTIE_DECHET_URL,
  },
  {
    id: uniqueId(),
    title: "Retours déchets",
    icon: "mdi:login",
    href: RETOUR_DECHET_URL,
  },
  {
    id: uniqueId(),
    title: "Envois fournisseur déchets",
    icon: "bitcoin-icons:send-filled",
    href: ENVOI_FRS_DECHET_URL,
  },
  {
    id: uniqueId(),
    title: "Pesées",
    icon: "fa-solid:weight",
    href: PESEE_URL,
  },
  {
    navlabel: true,
    subheader: "Finance",
  },
  {
    id: uniqueId(),
    title: "Réglements déchets",
    icon: "f7:money-euro-circle",
    href: REGLEMENT_DECHET_URL,
  },
  {
    id: uniqueId(),
    title: "Versements déchets",
    icon: "streamline-freehand:money-bag",
    href: VERSEMENT_DECHET_URL,
  },
  {
    navlabel: true,
    subheader: "Paramètres",
  },
  {
    id: uniqueId(),
    title: "Paramètres tables",
    icon: "icon-park-outline:config",
    href: PARAMETRE_URL,
  },
  {
    id: uniqueId(),
    title: "Périodes",
    icon: "ion:calendar-outline",
    href: PERIODE_URL,
  },
  {
    id: uniqueId(),
    title: "Soldes initiaux",
    icon: "at-icons:numbers",
    href: CLIENT_DECHET_SLD_INI_URL,
  },
  {
    id: uniqueId(),
    title: "Coéff articles déchets",
    icon: "octicon:number-16",
    href: ARTICLE_DECHET_COEFF_URL,
  },
  {
    navlabel: true,
    subheader: "Utilisateur",
  },

  {
    id: uniqueId(),
    title: "Profile",
    icon: "solar:user-circle-linear",
    href: USER_PROFILE_URL,
  },
  {
    navlabel: true,
    subheader: "Admin",
  },
  {
    id: uniqueId(),
    title: "Hash mot de passe",
    icon: "solar:key-linear",
    href: PASSWORD_HASH_URL,
  },
  {
    id: uniqueId(),
    title: "Sessions actives",
    icon: "solar:monitor-smartphone-linear",
    href: ADMIN_SESSIONS_URL,
  },
  {
    navlabel: true,
    subheader: "Autres",
  },
  {
    id: uniqueId(),
    title: "A propos de",
    icon: "ix:about",
    href: "/about",
  },
];

export default Menuitems;