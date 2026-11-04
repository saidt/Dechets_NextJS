import { useContext } from "react";
import Link from "next/link";
import {
  ListItemIcon,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
  ListItemButton,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { Icon } from "@iconify/react";
import { CustomizerContext } from "@/app/context/customizerContext";
import { Item_Type } from "../../types";

// Module level: a styled component created inside a component is a new component
// type on every render, so React remounted everything inside it.
type NavItemStyleProps = { level?: number; active: boolean; hideMenu?: boolean; radius: number };
const ListItemStyled = styled(ListItemButton, {
  shouldForwardProp: (prop) => !['level', 'active', 'hideMenu', 'radius'].includes(prop as string),
})<NavItemStyleProps>(({ theme, level, active, hideMenu, radius }) => ({
  whiteSpace: "nowrap",
  marginBottom: "2px",
  padding: "8px 10px",
  borderRadius: `${radius * 3}px`,
  backgroundColor: (level ?? 1) > 1 ? "transparent !important" : "inherit",
  color:
    (level ?? 1) > 1 && active
      ? `${theme.palette.secondary.main}!important`
      : theme.palette.text.primary,
  paddingLeft: hideMenu ? "12px" : (level ?? 2) > 2 ? `${(level ?? 0) * 15}px` : "12px",
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.main,
  },
  "&.Mui-selected": {
    color: "white",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
    },
  },
}));

export default function NavItem({
  item,
  level,
  pathDirect,
  hideMenu,
  onClick,
}: Item_Type) {

  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const theme = useTheme();
  const { t } = useTranslation();
  const itemIcon = Icon ? (
    (level ?? 1) > 1 ?
      <Icon icon={item.icon || ''} height={14} /> :

      <Icon icon={item.icon || ''} height={20} />
  ) : null
  const { isBorderRadius } = useContext(CustomizerContext);


  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      <Link href={item.href || ''}>
        <ListItemStyled
          level={level}
          active={pathDirect === item?.href}
          hideMenu={!!hideMenu}
          radius={isBorderRadius}
          disabled={item?.disabled}
          selected={pathDirect === item?.href}
          onClick={lgDown ? onClick : undefined}
        >
          <ListItemIcon
            sx={{
              minWidth: "32px",
              p: "3px 0",
              color:
                (level ?? 1) > 1 && pathDirect === item?.href
                  ? `${theme.palette.secondary.main}!important`
                  : "inherit",
            }}
          >
            {itemIcon}
          </ListItemIcon>
          <ListItemText>
            {hideMenu ? "" : <>{t(`${item?.title}`)}</>}
            <br />
            {item?.subtitle ? (
              <Typography variant="caption">
                {hideMenu ? "" : item?.subtitle}
              </Typography>
            ) : (
              ""
            )}
          </ListItemText>

          {!item?.chip || hideMenu ? null : (
            <Chip
              color={(item?.chipColor as "default" | "error" | "primary" | "secondary" | "info" | "success" | "warning") || "default"}
              variant={(item?.variant as "filled" | "outlined") || "filled"}
              size="small"
              label={item?.chip}
            />
          )}
        </ListItemStyled>
      </Link>
    </List>
  );
}