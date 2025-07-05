"use client";

import { useEffect } from "react";
import { useServerStatus } from "@/context/StatusContext";
import { signOut } from "next-auth/react";

const SystemAlerts = () => {
    const { isServerUp, sessionExpired, setSessionExpired } = useServerStatus();

    useEffect(() => {
        if (sessionExpired) {
            // Espera unos segundos antes de redirigir, o podría ir al hacer clic en botón
            const timeout = setTimeout(() => {
                sessionStorage.clear();
                localStorage.removeItem("token");
                setSessionExpired(false);
                signOut({ callbackUrl: "/auth/signin" });
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [sessionExpired]);

    if (isServerUp && !sessionExpired) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            {!isServerUp && (
                <div className="bg-red-600 text-white text-center p-2">
                    🚨 El servidor está apagado. Algunas funciones pueden no estar disponibles.
                </div>
            )}
            {sessionExpired && (
                <div className="bg-yellow-500 text-black text-center p-2">
                    ⚠ Tu sesión ha expirado. Serás redirigido al login en unos segundos...
                </div>
            )}
        </div>
    );
};

export default SystemAlerts;