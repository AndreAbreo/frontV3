import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EquipoEdit from "@/components/Equipos/editarEquipo";

export const metadata: Metadata = {
  title: "Editar equipo",
};

const editarEquipo: React.FC = function() {
  return (
      <DefaultLayout>
        <Breadcrumb pageName="Editar equipos" />
        <EquipoEdit />
      </DefaultLayout>
  );
};

export default editarEquipo;