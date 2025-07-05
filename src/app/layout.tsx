"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { Providers } from "@/app/Providers";
import { SessionProvider } from "next-auth/react";
import { ServerStatusProvider } from "@/context/StatusContext";
import SystemAlerts from "@/context/SystemAlerts";

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <html lang="es">
        <body suppressHydrationWarning={true}>
        <SessionProvider>
            <ServerStatusProvider>
                <div className="dark:bg-boxdark-2 dark:text-bodydark">
                    <SystemAlerts />
                    <Providers>
                        {loading ? <Loader /> : children}
                    </Providers>
                </div>
            </ServerStatusProvider>
        </SessionProvider>
        </body>
        </html>
    );
}