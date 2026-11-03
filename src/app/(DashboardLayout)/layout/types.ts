import { IconifyIcon } from "@iconify/react";
import type { MouseEvent } from "react";

interface NavGroupProps {
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: string | IconifyIcon;
  href?: string;
  children?: NavGroup[];
  bgcolor?: string;
}

export interface NavCollapseProps {
  menu: NavGroupProps;
  level: number;
  pathWithoutLastPart: string;
  pathDirect: string;
  hideMenu?: boolean | "";

  onClick: (event: MouseEvent<HTMLElement>) => void;
}

export type NavGroup = {
  subtitle?: string;
  disabled?: boolean;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: string | IconifyIcon;
  href?: string;
  children?: NavGroup[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
  level?: number;
  bgcolor?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export interface Item_Type {
  item: NavGroup;

  onClick: (event: MouseEvent<HTMLElement>) => void;
  hideMenu?: boolean | "";
  level?: number;
  pathDirect: string;
}