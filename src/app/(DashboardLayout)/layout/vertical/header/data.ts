//
// Profile dropdown
//
interface ProfileType {
  href: string;
  title: string;
}
const profile: ProfileType[] = [
  {
    href: "/protected/user-profile",
    title: "Profile utilisateur",
  },
];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: "/auth/login",
    title: "Login",
  },
  {
    href: "/404",
    title: "404 Error Page",
  },
  {
    href: "/user-profile",
    title: "User Application",
  },
];

export { profile, pageLinks };