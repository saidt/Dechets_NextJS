"use client";

import { useEffect, useState } from "react";
import { Menu } from "@mui/material";
import { useRouter } from "next/navigation";
import { clientError } from "@/lib/error";
import { useSession } from "next-auth/react";
import Loading from "../ui/Loading";
import { OptionsButton, TipButtonProps } from "../ui/ActionButtons";
import React from "react";
import useAuth from "@/app/context/UseAuth";
import { useAppContext } from "@/app/context/AppContext";

interface FormShowMenuProps extends TipButtonProps {
  optionsMenu: React.ReactNode[];
}

export default function FormShowMenu({
  optionsMenu,
  ...restprops
}: FormShowMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: session, status } = useSession();
  const { authLoading } = useAuth();
  const user = session?.user
  const router = useRouter();
  const { getCurrentUrl } = useAppContext();
    const curUrl = getCurrentUrl()

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("FormShowMenu: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("FormShowMenu: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  //consoleInfo("DataTableMenu user:", JSON.stringify(user))

  if (status === "loading" || authLoading) return <Loading />;
  if (!session || !user) return null;

  return (
    <>
      <OptionsButton {...restprops} onClick={handleMenuClick} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {optionsMenu.map((item, index) =>
          React.isValidElement<{
            onClick?: React.MouseEventHandler<HTMLElement>;
          }>(item)
            ? React.cloneElement(item, {
                key: index,
                onClick: (event: React.MouseEvent<HTMLElement>) => {
                  item.props.onClick?.(event); // ✅ safe
                  handleCloseMenu();
                },
              })
            : item,
        )}
      </Menu>
    </>
  );
}
