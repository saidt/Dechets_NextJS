import { useContext } from 'react';
import Link from "next/link";
import { styled } from "@mui/material";
import { CustomizerContext } from "@/app/context/customizerContext";
import Image from "next/image";
import config from "@/app/context/config";

const AuthLogo = () => {
  const { isCollapse, isSidebarHover } = useContext(CustomizerContext);

  const TopbarHeight = config.topbarHeight
  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse == "mini-sidebar" && !isSidebarHover ? '40px' : '180px',
    overflow: "hidden",
    display: "block",
  }));

    return (
      <LinkStyled href="/">
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