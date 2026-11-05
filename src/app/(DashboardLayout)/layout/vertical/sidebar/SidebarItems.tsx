import Menuitems, { filterMenuByRole } from './MenuItems';
import useAuth from '@/app/context/UseAuth';
import { usePathname } from "next/navigation";
import { Box, List, useMediaQuery } from '@mui/material';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup, { isNavGroup, NavItem_Type } from './NavGroup';

import { CustomizerContext } from '@/app/context/customizerContext';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import GuestMenuitems from './GuestNavItems';

const SidebarItems = () => {

  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const { isSidebarHover, isCollapse, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse == "mini-sidebar" && !isSidebarHover : '';

  const showItems = (items: NavItem_Type[]) => {
    return (
      items.map((item) => {
        // {/********SubHeader**********/}
       if (isNavGroup(item)) {
          return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;
        } 
        // {/********If Sub Menu**********/}
        else if (item.children) {
          return (
            <NavCollapse
              menu={item}
              pathDirect={pathDirect}
              hideMenu={hideMenu}
              pathWithoutLastPart={pathWithoutLastPart}
              level={1}
              key={item.id}
              onClick={() => setIsMobileSidebar(!isMobileSidebar)}
            />
          );

          // {/********If Sub No Menu**********/}
        } 
        else {
          return (
            <NavItem item={item} key={item.id} pathDirect={pathDirect} hideMenu={hideMenu} onClick={() => setIsMobileSidebar(!isMobileSidebar)} />
          );
        }
      }
    ))
  }

  const { data: session} = useSession()
  // Only the menus the user has the role for
  const { hasRole } = useAuth()

  return (
    <Box sx={{ px: 2, borderRadius: 0, mt: 2 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
      { session ? showItems(filterMenuByRole(Menuitems, hasRole)) : showItems(GuestMenuitems)} 
      </List>
    </Box>
  );
};
export default SidebarItems;