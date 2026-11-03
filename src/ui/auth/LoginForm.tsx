"use client"; 

import { Box, TextField, Button, Typography, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from "next/navigation";
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

  consoleInfo('LoginForm callbackUrl: ', callbackUrl)

  const router = useRouter();

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
        router.push(callbackUrl || '/');
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
        error={!!errors.userId}
        helperText={errors.userId?.message}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Password"
        type="password"
        {...register("password")}
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