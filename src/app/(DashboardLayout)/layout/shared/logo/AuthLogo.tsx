import { useContext } from 'react';
import Link from "next/link";
import { styled } from "@mui/material";
import { CustomizerContext } from "@/app/context/customizerContext";
import Image from "next/image";
import config from "@/app/context/config";

// Module level: a styled component created inside a component is a new component
// type on every render, so React remounted everything inside it.
// collapsed: mini sidebar not hovered -> show only the icon part of the logo
const LinkStyled = styled(Link, { shouldForwardProp: (prop) => prop !== 'collapsed' })<{ collapsed: boolean }>(({ collapsed }) => ({
  height: config.topbarHeight,
  width: collapsed ? '40px' : '180px',
  overflow: "hidden",
  display: "block",
}));

const AuthLogo = () => {
  const { isCollapse, isSidebarHover } = useContext(CustomizerContext);

  const TopbarHeight = config.topbarHeight
    return (
      <LinkStyled href="/" collapsed={isCollapse == "mini-sidebar" && !isSidebarHover}>
        <Image
          src="/images/logos/Imacab-logo.svg"
          alt="logo"
          height={TopbarHeight}
          width={174}
          priority
        />
      </LinkStyled>
    );
}

export default AuthLogo;