import React from "react";
import MyApp from "./app";
import NextTopLoader from 'nextjs-toploader';
//import "./global.css";
import { CustomizerContextProvider } from "@/app/context/customizerContext";
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { NavigationHistory } from "./providers/navigation-history";

export const metadata = {
  title: "Gestion des déchets Imacab",
  description: "Gestion des déchets Imacab",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="#43CED7" />
        <CustomizerContextProvider>
          <MyApp session={session}>
            <NavigationHistory />
            {children}
          </MyApp>
        </CustomizerContextProvider>
      </body>
    </html>
  );
}