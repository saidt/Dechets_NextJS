import { useContext } from 'react';
import { CustomizerContext } from "@/app/context/customizerContext";
import Link from "next/link";
import { styled } from "@mui/material";
import config from "@/app/context/config";
import Image from "next/image";

// Module level: a styled component created inside a component is a new component
// type on every render, so React remounted everything inside it.
// collapsed: mini sidebar not hovered -> show only the icon part of the logo
const LinkStyled = styled(Link, { shouldForwardProp: (prop) => prop !== 'collapsed' })<{ collapsed: boolean }>(({ collapsed }) => ({
  height: config.topbarHeight,
  width: collapsed ? '40px' : '180px',
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  const { isCollapse, isSidebarHover } = useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight

  return (
    <LinkStyled href="/" collapsed={isCollapse == "mini-sidebar" && !isSidebarHover}>
      <Image
        src="/images/logos/Imacab-logo.svg"
        alt="logo"
        height={TopbarHeight}
        width={153}
        priority
      />
    </LinkStyled>
  );
}

export default Logo;