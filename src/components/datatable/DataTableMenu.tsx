"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  IconButtonProps,
  Divider,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import UserTableFilterLoadDialog from "../ui/dialog/UserTableFilterLoadDialog";
import { Filter } from "@/lib/types";
import UserTableFilterSaveDialog from "../ui/dialog/UserTableFilterSaveDialog";
import { clientError } from "@/lib/error";
import { useSession } from "next-auth/react";
import Loading from "../ui/Loading";
import { OptionsButton } from "../ui/ActionButtons";
import { LastAccessedMenu, ReadContextMenu, ReadFilterMenu, SaveContextMenu, SaveFilterMenu } from "../ui/menu/Menus";
import React from "react";
import useAuth from "@/app/context/UseAuth";
import { useAppContext } from "@/app/context/AppContext";

interface DataTableMenuProps<T extends Record<string, any>> extends IconButtonProps {
  lastViewedId: string | number | null;
  lastViewedPath: string;
  isModalList: boolean;
  tableName: string;
  filter: Filter<T>;
  optionsMenu?: React.ReactNode[];
  onSaveContext: () => void;
  onReadContext: () => void;
  onSaveFilter: (filterName: string) => void;
  onLoadFilter: (filter: Filter<T>) => void;
}

export default function DataTableMenu<T extends Record<string, any>>(props: DataTableMenuProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLoadDialog, setOpenLoadDialog] = useState<boolean>(false);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const { authLoading } = useAuth();
  const router = useRouter();

  const { getCurrentUrl } = useAppContext();
    const curUrl = getCurrentUrl()

  const user = session?.user;

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("Session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("DataTableMenu: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);
 
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const pathname = usePathname();

  const handleLastViewed = () => {
    //consoleInfo('DataTableMenu props.lastViewedPath: ', props.lastViewedPath)
    router.push(`${pathname}/${props.lastViewedPath}`);
  };

  const handleSaveContext = () => {
    handleCloseMenu();
    props.onSaveContext()
  };

  const handleReadContext = () => {
    handleCloseMenu();
    props.onReadContext()
  };

  const handleSaveFilter = () => {
    handleCloseMenu();
    setOpenSaveDialog(true)
  };

  const handleLoadFilter = () => {
    handleCloseMenu()
    setOpenLoadDialog(true)
  };

  if (status === "loading" || authLoading) return <Loading />;
  if (!session || !user) return null;

  return (
    <>
      <OptionsButton onClick={handleMenuClick} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {!props.isModalList &&
          <LastAccessedMenu lastAccessed={props.lastViewedId} onClick={handleLastViewed} />
        }
        <Divider />
        <SaveContextMenu onClick={handleSaveContext} />
        <ReadContextMenu onClick={handleReadContext} />
        <Divider />
        <SaveFilterMenu onClick={handleSaveFilter} />
        <ReadFilterMenu onClick={handleLoadFilter} />
        {props.optionsMenu && <Divider />}
        {props.optionsMenu && props.optionsMenu.map((item, index) =>
          React.isValidElement<{
            onClick?: React.MouseEventHandler<HTMLElement>;
          }>(item)
            ? React.cloneElement(item, {
                key: index,
                onClick: (event: React.MouseEvent<HTMLElement>) => {
                  item.props.onClick?.(event);
                  handleCloseMenu();
                },
              })
            : item,
        )}
      </Menu>

      <UserTableFilterLoadDialog
        open={openLoadDialog}
        onClose={() => setOpenLoadDialog(false)}
        tableName={props.tableName} 
        onLoadFilter={props.onLoadFilter}
      />

      <UserTableFilterSaveDialog
        open={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        tableName={props.tableName}
        filter={props.filter}
        onSaveFilter={props.onSaveFilter}
      />
    </>
  );
}