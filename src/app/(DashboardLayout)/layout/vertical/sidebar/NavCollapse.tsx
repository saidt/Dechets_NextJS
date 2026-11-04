import React, { useContext } from "react";

import { useState } from "react";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  ListItemIcon,
  ListItemButton,
  Collapse,
  styled,
  ListItemText,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { CustomizerContext } from "@/app/context/customizerContext";

// custom imports
import NavItem from "./NavItem";

// plugins
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { NavCollapseProps } from "../../types";

// FC Component For Dropdown Menu
// Module level: a styled component created inside a component is a new component
// type on every render, so React remounted everything inside it.
type NavCollapseStyleProps = { level: number; open: boolean; active: boolean; hideMenu?: boolean; radius: number };
const ListItemStyled = styled(ListItemButton, {
  shouldForwardProp: (prop) => !['level', 'open', 'active', 'hideMenu', 'radius'].includes(prop as string),
})<NavCollapseStyleProps>(({ theme, level, open, active, hideMenu, radius }) => ({
  marginBottom: "2px",
  padding: "8px 10px",
  paddingLeft: hideMenu ? "12px" : level > 2 ? `${level * 15}px` : "12px",
  backgroundColor: open && level < 2 ? theme.palette.secondary.main : "",
  whiteSpace: "nowrap",
  "&:hover": {
    backgroundColor:
      active || open
        ? theme.palette.secondary.main
        : theme.palette.secondary.light,
    color:
      active || open
        ? "white"
        : theme.palette.secondary.main,
  },
  color:
    open && level < 2
      ? "white"
      : level > 1 && open
        ? theme.palette.secondary.main
        : theme.palette.text.primary,
  borderRadius: `${radius * 3}px`,
}));

export default function NavCollapse({
  menu,
  level,
  pathWithoutLastPart,
  pathDirect,
  hideMenu,
  onClick,
}: NavCollapseProps) {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const { isBorderRadius } = useContext(CustomizerContext);

  //const Icon = menu?.icon;
  const pathname = usePathname();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);


  const menuIcon = Icon ? (
    level > 1 ? <Icon icon={menu.icon || ''} height={14} /> : <Icon icon={menu.icon || ''} height={20} />
  ) : null;


  const handleClick = () => {
    setOpen(!open);
  };

  // menu collapse for sub-levels
  React.useEffect(() => {
    setOpen(false);
    menu?.children?.forEach((item) => {
      if (item?.href === pathname) {
        setOpen(true);
      }
    });
  }, [pathname, menu.children]);


  // If Menu has Children
  const submenus = menu.children?.map((item) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item?.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={!!hideMenu}
          onClick={onClick}
        />
      );
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          pathDirect={pathDirect}
          hideMenu={!!hideMenu}
          onClick={() => lgDown ? onClick : null}
        />
      );
    }
  });

  return (
    <>
      <ListItemStyled
        level={level}
        open={open}
        active={pathname.includes(menu.href || '')}
        hideMenu={!!hideMenu}
        radius={isBorderRadius}
        onClick={handleClick}
        selected={pathWithoutLastPart === menu.href}
        key={menu?.id}
      >
        <ListItemIcon
          sx={{
            minWidth: "36px",
            p: "3px 0",
            color: "inherit",
          }}
        >
          {menuIcon}
        </ListItemIcon>
        <ListItemText color="inherit">
          {hideMenu ? "" : <>{t(`${menu.title}`)}</>}
        </ListItemText>
        {!open ? (
          <IconChevronDown size="1rem" />
        ) : (
          <IconChevronUp size="1rem" />
        )}
      </ListItemStyled>
      <Collapse in={open} timeout="auto">
        {submenus}
      </Collapse>
    </>
  );
}