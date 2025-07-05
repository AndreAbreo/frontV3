import React from "react";
import { Metadata } from "next";
import Registrar from "@/components/Usuarios/Login/Registrar";

export const metadata: Metadata = {
  title: "Registro en el sistema",
  description: "Página de registro al sistema",
};

const Registrarse: React.FC = function() {

  return (
      <Registrar />
  );
};

export default Registrarse;