import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Registrar from "@/components/Usuarios/crearUsuario";

export const metadata: Metadata = {
    title: "Agregar usuario",
    description: "Página para agregar usuario en el sistema",
};

const agregarUsuario: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar nuevo usuario" />
            <Registrar />
        </DefaultLayout>
    );
};

export default agregarUsuario;