"use client";

import { useEffect, useState } from "react";
import { Menu, IconButtonProps } from "@mui/material";
import { useRouter } from "next/navigation";
import { clientError } from "@/lib/error";
import { useSession } from "next-auth/react";
import React from "react";
import Loading from "../Loading";
import { OptionsButton } from "../ActionButtons";
import useAuth from "@/app/context/UseAuth";
import { useAppContext } from "@/app/context/AppContext";

interface OptionsMenuProps extends IconButtonProps {
  optionsMenu: React.ReactNode[];
}

export default function OptionsMenu(props: OptionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: session, status } = useSession();
  const { authLoading } = useAuth();
  const user = session?.user
  const router = useRouter();
  const { getCurrentUrl } = useAppContext();
  const curUrl = getCurrentUrl()

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("OptionsMenu: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("OptionsMenu: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

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
    </>
  )
}