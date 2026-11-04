import { ListSubheader, styled, Theme } from '@mui/material';
import { IconDots } from '@tabler/icons-react';

type NavGroupType = {
  navlabel?: boolean;
  subheader?: string;
};

type NavElementType = {
  id: string;
  title: string;
  icon: string;
  href: string;
  children?: NavElementType[];
}

export type NavItem_Type = NavGroupType | NavElementType;

interface Item_Type {
  item: NavGroupType;
  hideMenu: string | boolean;
}

export function isNavGroup(item: NavItem_Type): item is NavGroupType {
  return 'subheader' in item;
}

export function isNavElement(item: NavItem_Type): item is NavElementType {
  return 'id' in item;
}

// Module level: a styled component created inside a component is a new component
// type on every render, so React remounted everything inside it.
const ListSubheaderStyle = styled(
  (props: Theme | any) => <ListSubheader disableSticky {...props} />,
  { shouldForwardProp: (prop) => prop !== 'hideMenu' },
)(({ theme, hideMenu }: { theme: Theme; hideMenu?: boolean }) => ({
  ...theme.typography.overline,
  fontWeight: '700',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(0),
  color: theme.palette.text.primary,
  lineHeight: '26px',
  padding: '3px 12px',
  marginLeft: hideMenu ? '' : '-10px',
}));

const NavGroup = ({ item, hideMenu }: Item_Type) => {
  return (
    <ListSubheaderStyle hideMenu={hideMenu}>{hideMenu ? <IconDots size="14" /> : item?.subheader}</ListSubheaderStyle>
  );
};

export default NavGroup;
