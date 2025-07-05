import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import Perfil from "@/components/PerfilUser/perfil";

export const metadata: Metadata = {
  title: "MAMED - Editar mis datos",
  description:
    "Pagina para editar los datos del usuario ingresado",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" />
        <Perfil />
      </div>
    </DefaultLayout>
  );
};

export default Profile;