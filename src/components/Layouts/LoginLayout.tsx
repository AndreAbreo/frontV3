"use client";
import React, { useState, ReactNode } from "react";
import LoginHeader from "@/components/Header/LoginHeader";

export default function LoginLayout({children,}: {children: React.ReactNode;}) {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <>
                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== Header Start ===== --> */}
                    <LoginHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    {/* <!-- ===== Header End ===== --> */}
                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {children}
                            <div className="text-center text-xs text-gray-500 py-4">
                                Realizado con ♥ por  CodigoCreativo © 2024
                            </div>
                        </div>
                    </main>
                </div>
        </>
    );
}
