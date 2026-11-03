import { useState, useContext, SetStateAction, useEffect } from 'react';
import Link from "next/link";
import { Box, Menu, Typography, Divider, IconButton } from '@mui/material';
import * as dropdownData from './data';
import { CustomizerContext } from '@/app/context/customizerContext'
import { Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signIn, signOut, useSession } from 'next-auth/react'
import Loading from '@/components/ui/Loading';
import { ROLES_CACHE_KEY } from '@/lib/consts';
import { useRouter } from 'next/navigation';
import { clientError } from '@/lib/error';
import { useAppContext } from '@/app/context/AppContext';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<HTMLElement | null>(null);
  const { activeMode, setActiveMode } = useContext(CustomizerContext);

  const handleClick2 = (event: { currentTarget: SetStateAction<HTMLElement | null>; }) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogin = async () => {
    signIn()
  };

  const handleLogout = async () => {
    sessionStorage.removeItem(ROLES_CACHE_KEY);
    signOut({ callbackUrl: "/auth/login", redirect: true })
  };

  const { data: session, status } = useSession()

  const router =  useRouter()
  const { getCurrentUrl } = useAppContext();
  const curUrl = getCurrentUrl()

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("Profile: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]); 

  if (status === 'loading') {
    return <Loading />
  }

  const LoggedIn = () => (
    <>
      <Stack direction="row" sx={{ p: 2, alignItems: 'center' }} spacing={2}>
        <AccountCircleIcon />
          <Box>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
              {session?.user.id} ({session?.user.name})
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 400,
              }}
            >
              {session?.user.email}
            </Typography>
          </Box>
      </Stack>
      <Divider />
      <Box sx={{ p: 2 }}>
        {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box
              sx={{
                px: 2,
                py: '10px',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              }}
              className="hover-text-primary"
            >
              <Link href={profile.href}>
                <Stack direction="row" spacing={2}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: '240px',
                        fontWeight: 500,
                      }}
                    >
                      {profile.title}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            px: 2,
            py: '10px',
            '&:hover': {
              backgroundColor: 'primary.light',
            },
          }}
          className="hover-text-primary"
        >
          <Link href="/">
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Box onClick={() => {
                setActiveMode(activeMode === 'light' ? 'dark' : 'light');
              }}>
                <Typography
                  variant="subtitle2"
                  color="text.primary"
                  className="text-hover"
                  noWrap
                  sx={{
                    width: '240px',
                    fontWeight: 500,
                  }}
                >
                  Mode
                </Typography>
              </Box>
              <IconButton color="primary" size="small">
                {activeMode === 'light' ? (
                  <Icon
                    icon="solar:moon-line-duotone"
                    height={18}
                    onClick={() => setActiveMode('dark')}
                  />
                ) : (
                  <Icon
                    icon="solar:sun-2-line-duotone"
                    height={18}
                    onClick={() => setActiveMode('light')}
                  />
                )}
              </IconButton>
            </Stack>
          </Link>
        </Box>
        <Box
          sx={{
            px: 2,
            py: '10px',
            '&:hover': {
              backgroundColor: 'primary.light',
            },
          }}
          className="hover-text-primary"
        >
          <Stack direction="row" spacing={2}>
            <Box onClick={handleLogout} sx={{ cursor: "pointer" }} >
              <Typography
                variant="subtitle2"
                color="text.primary"
                className="text-hover"
                noWrap
                sx={{
                  width: '240px',
                  fontWeight: 500,
                }}
              >
                Logout
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  )

  const NotLoggedIn = () => (
    <Box
      sx={{
        px: 2,
        py: '10px',
        '&:hover': {
          backgroundColor: 'primary.light',
        },
      }}
      className="hover-text-primary"
    >
      <Stack direction="row" spacing={2}>
        <Box onClick={handleLogin} sx={{ cursor: "pointer" }} >
          <Typography
            variant="subtitle2"
            color="text.primary"
            className="text-hover"
            noWrap
            sx={{
              width: '240px',
              fontWeight: 500,
            }}
          >
            Login
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
           
  return (
    <Box>
      <IconButton
        onClick={handleClick2}
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            p: 0,
          },
        }}
      >
        {session ? (<LoggedIn />) : (<NotLoggedIn />)}
      </Menu>
    </Box>
  );
};

export default Profile;