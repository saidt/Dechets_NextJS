import { uniqueId } from "@/lib/lib";
import { NavItem_Type } from "./NavGroup";

const GuestMenuitems: NavItem_Type[] = [
  {
    id: uniqueId(),
    title: "A propos de",
    icon: "ix:about",
    href: "/about",
  },
  {
    id: uniqueId(),
    title: "FAQ",
    icon: "streamline-ultimate:contact-us-faq",
    href: "/theme-pages/faq",
  },
  
  {
    navlabel: true,
    subheader: "Auth",
  },

  {
    id: uniqueId(),
    title: "Login",
    icon: "solar:lock-keyhole-minimalistic-linear",
    href: "/auth/login",
  },

];

export default GuestMenuitems;