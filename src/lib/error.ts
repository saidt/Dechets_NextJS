import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RedirectType } from "next/navigation";
import { getAllCookies } from "./html";
import { localLog } from "@/components/logger/localLog";
import { AlertColor } from "@mui/material";

export function serverError(
  message: string,
  error: any,
  pathName: string,
  redirect: (url: string, type?: typeof RedirectType) => never,
) {
  const msg = `${message} ${error ? ' / ' + String(error) : ''}`
  redirect(`/error?message=${encodeURIComponent(msg)}&path=${encodeURIComponent(pathName)}`);
}

export function clientError(
  message: string,
  error: any,
  pathName: string,
  router: AppRouterInstance,
) {
  const msg = `${message} ${error ? ' / ' + String(error) : ''}`
  router.push(`/error?message=${encodeURIComponent(msg)}&path=${encodeURIComponent(pathName)}`);
}

export const handleError = (
  fallbackMessage: string,
  error: unknown,
  addNotification: (message: string, severity?: AlertColor) => void
) => {
  const allCookies = getAllCookies();

  // Log full error (for debugging / monitoring)
  localLog("error", String(error), allCookies, {});

  // Extract readable error message
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
      ? error.message
      : (error as any)?.response?.data?.message // Axios / API errors
      ?? fallbackMessage;

  // Display error to user
  addNotification(message, "error");
};