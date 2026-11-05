"use client"; 

import { Box, TextField, Button, Typography, Divider, IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from 'react'
import { useSearchParams } from "next/navigation";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { credentials_Schema, Credentials_Form_Data, Credentials } from '../../types/credentials';
import { signIn } from 'next-auth/react';
import LoginIcon from '@mui/icons-material/Login';
import ErrorMsg from '@/components/ErrorMsg';
import { consoleError, consoleInfo } from '@/lib/clientLog';

export default function LoginForm({ 
  credentials, errorMsg }: {credentials: Credentials, errorMsg: string | null}) {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors },
  } = useForm<Credentials_Form_Data>({
    resolver: zodResolver(credentials_Schema),
    defaultValues: credentials,
  });

  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState(errorMsg)
  const [showPassword, setShowPassword] = useState(false)

  consoleInfo('LoginForm callbackUrl: ', callbackUrl)


  useEffect(() => {
    if (credentials) {
      reset(credentials);
    }
  }, [credentials, reset]);

  const onSubmit = async (data: Credentials_Form_Data) => {
    //e.preventDefault();
    //consoleInfo('data : ', data);
    setSubmitting(true)
    setError('')
    try {      
      const result = await signIn('credentials', {
        userId: data.userId,
        password: data.password,
        redirect: false, // ← get the result back
        callbackUrl,
      })
      if (result?.error) {
        setError(result.error,)
      } 
      else if (result?.ok) {
        // Full page load (not router.push): browsers' password managers (Firefox in
        // particular) offer to save the credentials when the page is left after a login
        // form submission; a client-side route change is not detected.
        window.location.assign(callbackUrl || '/');
        return;
      }
    } 
    catch (err) {
      consoleError('Login error:', err)
      setError('An unexpected error occurred')
    } 
    finally {
      setSubmitting(false)
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 500 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
        Connexion
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <TextField
        label="User id"        
        {...register("userId")}
        id="userId"
        autoComplete="username"   // lets password managers recognise the login form
        error={!!errors.userId}
        helperText={errors.userId?.message}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        {...register("password")}
        id="password"
        autoComplete="current-password"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setShowPassword((v) => !v)}
                  onMouseDown={(e) => e.preventDefault()}   // keep the focus in the password field
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={submitting}
        sx={{ mt: 2 }}
        startIcon={<LoginIcon />}
      >
        {submitting ? 'Signing In...' : 'Login'}
      </Button>
      {error && <ErrorMsg error={error} />}
    </Box>
  )
}