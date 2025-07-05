import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditUsuario from "@/components/Usuarios/editarUsuario";

export const metadata: Metadata = {
  title: "Editar usuario",
  description: "Editar usuario ingresado",
};

const editarUsuario: React.FC = function() {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Editar usuario" />
      <EditUsuario />
    </DefaultLayout>
  );
};

export default editarUsuario;