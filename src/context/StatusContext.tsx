import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const ServerStatusContext = createContext<{
    isServerUp: boolean;
    sessionExpired: boolean;
    setSessionExpired: (v: boolean) => void;
}>({
    isServerUp: true,
    sessionExpired: false,
    setSessionExpired: () => {},
});

export const ServerStatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [isServerUp, setIsServerUp] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);
    const { data: session, status } = useSession();

    const checkServerStatus = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_REST}/status`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + (session?.user?.accessToken || ""),
                },
                cache: "no-store",
            });

            if ([404, 500, 503, 504].includes(response.status)) {
                setIsServerUp(false);
                console.error("Servidor no responde.");
                return;
            }

            if (response.status === 401) {
                console.warn("Token expirado.");
                setSessionExpired(true); // ✅ Setear expiración
                return;
            }

            const data = await response.json();
            setIsServerUp(data.status === "up");
        } catch (error) {
            console.error("Error verificando el servidor:", error);
            setIsServerUp(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            checkServerStatus();
            const interval = setInterval(checkServerStatus, 10000);
            return () => clearInterval(interval);
        }
    }, [status, session]);

    return (
        <ServerStatusContext.Provider value={{ isServerUp, sessionExpired, setSessionExpired }}>
            {children}
        </ServerStatusContext.Provider>
    );
};

export const useServerStatus = () => useContext(ServerStatusContext);