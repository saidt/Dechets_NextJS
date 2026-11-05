import { uniqueId } from "@/lib/lib";
import { isNavGroup, NavElementType, NavItem_Type } from "./NavGroup";
import { USER_PROFILE_URL } from "@/types/user-profile";
import { PASSWORD_HASH_URL, USER_UPDATE_PSWD_ROLE } from "@/types/user";
import { ADMIN_SESSIONS_URL, SESSION_ADMIN_ROLE } from "@/types/admin-session";
import { UNITE_URL, UNITE_TABLE_NAME } from "@/types/unite";
import { CLIENT_DECHET_URL, CLIENT_DECHET_TABLE_NAME } from "@/types/client-dechet";
import { ARTICLE_URL, ARTICLE_TABLE_NAME } from "@/types/article";
import { PARAMETRE_URL, PARAMETRE_TABLE_NAME } from "@/types/parametre";
import { ARTICLE_DECHET_COEFF_URL, ARTICLE_DECHET_COEFF_TABLE_NAME } from "@/types/article-dechet-coeff";
import { SORTIE_DECHET_URL, SORTIE_DECHET_TABLE_NAME } from "@/types/sortie-dechet";
import { PERIODE_URL, PERIODE_TABLE_NAME } from "@/types/periode";
import { RETOUR_DECHET_URL, RETOUR_DECHET_TABLE_NAME } from "@/types/retour-dechet";
import { REGLEMENT_DECHET_URL, REGLEMENT_DECHET_TABLE_NAME } from "@/types/reglement-dechet";
import { VERSEMENT_DECHET_URL, VERSEMENT_DECHET_TABLE_NAME } from "@/types/versement-dechet";
import { CLIENT_DECHET_SLD_INI_URL, CLIENT_DECHET_SLD_INI_TABLE_NAME } from "@/types/client-dechet-sld-ini";
import { ENVOI_FRS_DECHET_URL, ENVOI_FRS_DECHET_TABLE_NAME } from "@/types/envoi-frs-dechet";
import { PESEE_URL, PESEE_TABLE_NAME } from "@/types/pesee";

import { UNITE_CONVERSION_TABLE_NAME } from "@/types/unite-conversion";

// List pages check the <TABLE>.LIST role (GenericListPage), so their menu needs the same
const listRole = (tableName: string) => `${tableName}.LIST`;

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
    role: listRole(CLIENT_DECHET_TABLE_NAME),
  },
  {
    id: uniqueId(),
    title: "Articles déchets",
    icon: "hugeicons:group-items",
    href: ARTICLE_URL,
    role: listRole(ARTICLE_TABLE_NAME),
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
        role: listRole(UNITE_TABLE_NAME),
      },
      {
        id: uniqueId(),
        title: "Conversion d'unités",
        icon: "streamline-plump:convert-pdf-1-solid",
        href: "/protected/unite-conversion",
        role: listRole(UNITE_CONVERSION_TABLE_NAME),
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
    role: listRole(SORTIE_DECHET_TABLE_NAME),
  },
  {
    id: uniqueId(),
    title: "Retours déchets",
    icon: "mdi:login",
    href: RETOUR_DECHET_URL,
    role: listRole(RETOUR_DECHET_TABLE_NAME),
  },
  {
    id: uniqueId(),
    title: "Envois fournisseur déchets",
    icon: "bitcoin-icons:send-filled",
    href: ENVOI_FRS_DECHET_URL,
    role: listRole(ENVOI_FRS_DECHET_TABLE_NAME),
  },
  {
    id: uniqueId(),
    title: "Pesées",
    icon: "fa-solid:weight",
    href: PESEE_URL,
    role: listRole(PESEE_TABLE_NAME),
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
    role: listRole(REGLEMENT_DECHET_TABLE_NAME),
  },
  {
    id: uniqueId(),
    title: "Versements déchets",
    icon: "streamline-freehand:money-bag",
    href: VERSEMENT_DECHET_URL,
    role: listRole(VERSEMENT_DECHET_TABLE_NAME),
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
    role: listRole(PARAMETRE_TABLE_NAME),
  },
  {
    id: uniqueId(),
    title: "Périodes",
    icon: "ion:calendar-outline",
    href: PERIODE_URL,
    role: listRole(PERIODE_TABLE_NAME),
  },
  {
    id: uniqueId(),
    title: "Soldes initiaux",
    icon: "at-icons:numbers",
    href: CLIENT_DECHET_SLD_INI_URL,
    role: listRole(CLIENT_DECHET_SLD_INI_TABLE_NAME),
  },
  {
    id: uniqueId(),
    title: "Coéff articles déchets",
    icon: "octicon:number-16",
    href: ARTICLE_DECHET_COEFF_URL,
    role: listRole(ARTICLE_DECHET_COEFF_TABLE_NAME),
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
    role: USER_UPDATE_PSWD_ROLE,
  },
  {
    id: uniqueId(),
    title: "Sessions actives",
    icon: "solar:monitor-smartphone-linear",
    href: ADMIN_SESSIONS_URL,
    role: SESSION_ADMIN_ROLE,
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


/**
 * Menu items the user may see: items with a role the user doesn't have are removed,
 * a sub-menu without visible children is removed, and a group title (subheader) is
 * removed when no item follows it. Display only: pages and APIs check roles anyway.
 */
export function filterMenuByRole(items: NavItem_Type[], hasRole: (role: string) => boolean): NavItem_Type[] {
  const allowed = (item: NavElementType): NavElementType | null => {
    if (item.role && !hasRole(item.role)) return null;
    if (item.children) {
      const children = item.children.map(allowed).filter((c): c is NavElementType => c !== null);
      return children.length > 0 ? { ...item, children } : null;
    }
    return item;
  };

  const visible = items
    .map((item) => (isNavGroup(item) ? item : allowed(item)))
    .filter((item): item is NavItem_Type => item !== null);

  // Drop group titles followed by no item (next title or end of list)
  return visible.filter((item, i) => !isNavGroup(item) || (i + 1 < visible.length && !isNavGroup(visible[i + 1])));
}

export default Menuitems;
