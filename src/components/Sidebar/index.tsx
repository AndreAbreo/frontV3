"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { useSession } from "next-auth/react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userPerfilId = session?.user?.idPerfil;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
        <div className="columns-2 justify-start"><Link href="/">
        <svg xmlns="http://www.w3.org/2000/svg" className="dark:bg-white dark:rounded-full bg-white rounded-full" version="1.0" width="70" height="70" viewBox="0 0 324.000000 324.000000" preserveAspectRatio="xMidYMid meet">

<g transform="translate(-155.000000,552.000000) scale(0.20000,-0.200)" fill="#000000" stroke="none">
<path d="M1491 2740 c-470 -64 -782 -507 -681 -965 61 -276 260 -497 530 -588 90 -30 169 -40 288 -35 139 6 255 40 372 110 260 154 416 466 382 763 -25 219 -119 397 -285 536 -161 136 -402 206 -606 179z m504 -604 c0 -199 -3 -260 -12 -263 -10 -4 -13 35 -13 171 l0 176 -415 0 -415 0 2 -292 3 -293 63 -3 c44 -2 62 -7 59 -15 -2 -8 -30 -12 -83 -12 l-79 0 -3 375 c-1 206 0 385 3 398 l5 22 443 -2 442 -3 0 -259z m-341 5 c5 -8 -139 -247 -172 -284 -10 -11 -19 -14 -25 -8 -6 6 8 38 39 88 133 216 143 229 158 204z m-244 -35 c0 -8 -21 -35 -46 -61 l-47 -46 47 -48 c46 -46 57 -71 34 -71 -15 0 -118 100 -118 114 0 12 111 126 122 126 4 0 8 -6 8 -14z m364 -45 c66 -67 66 -68 -7 -140 -33 -31 -51 -42 -63 -37 -15 6 -10 14 29 54 26 26 47 52 47 56 0 5 -20 31 -46 58 -39 42 -49 68 -26 68 4 0 34 -26 66 -59z m164 -206 c6 -33 19 -40 47 -25 23 12 28 11 55 -15 30 -29 39 -58 20 -70 -15 -9 0 -33 26 -39 21 -6 24 -12 24 -56 0 -42 -3 -50 -19 -50 -26 0 -48 -27 -33 -42 20 -20 14 -43 -18 -73 -26 -25 -33 -28 -50 -17 -29 18 -39 15 -50 -13 -12 -32 -30 -39 -75 -31 -25 5 -35 12 -35 26 0 27 -18 34 -46 19 -22 -11 -27 -10 -59 21 -32 31 -34 36 -21 55 17 26 4 55 -24 55 -17 0 -20 7 -20 50 0 44 3 50 24 56 26 6 41 30 26 39 -19 12 -10 41 20 70 27 26 32 27 54 16 28 -15 46 -8 46 18 0 27 10 32 60 29 36 -2 46 -7 48 -23z m-432 -90 c4 -9 19 -15 35 -15 32 0 63 -37 53 -64 -4 -10 0 -18 10 -22 23 -9 23 -84 0 -84 -12 0 -15 -6 -10 -23 7 -31 -33 -72 -62 -63 -15 5 -22 1 -27 -14 -9 -27 -70 -28 -85 -1 -6 13 -17 17 -30 14 -29 -8 -63 25 -55 54 4 16 -1 25 -15 33 -27 15 -27 65 0 80 15 8 19 17 15 31 -9 28 21 59 55 59 16 0 30 7 34 15 3 9 19 15 41 15 22 0 38 -6 41 -15z"/>
<path d="M1140 2310 l0 -50 415 0 415 0 0 50 0 50 -415 0 -415 0 0 -50z m60 5 c0 -8 -4 -15 -9 -15 -13 0 -22 16 -14 24 11 11 23 6 23 -9z m67 -11 c-9 -9 -28 6 -21 18 4 6 10 6 17 -1 6 -6 8 -13 4 -17z m70 0 c-9 -9 -28 6 -21 18 4 6 10 6 17 -1 6 -6 8 -13 4 -17z"/>
<path d="M1863 1821 c-6 -23 -56 -43 -88 -35 -26 6 -42 -11 -27 -29 14 -16 -10 -72 -37 -87 -24 -12 -28 -40 -6 -40 23 0 47 -45 43 -82 -3 -30 -1 -33 22 -31 40 3 87 -16 93 -37 7 -26 37 -26 44 -1 6 24 56 43 91 34 23 -5 24 -4 20 22 -8 40 10 85 38 95 29 12 31 30 4 37 -27 7 -53 68 -40 93 12 22 -2 35 -27 26 -25 -10 -80 13 -86 34 -7 26 -37 26 -44 1z m85 -117 c48 -54 11 -136 -62 -136 -99 0 -120 130 -26 165 26 10 64 -3 88 -29z"/>
<path d="M1844 1679 c-17 -19 -17 -23 -3 -47 27 -49 89 -37 89 17 0 51 -51 69 -86 30z"/>
<path d="M1442 1725 c-7 -8 -24 -15 -37 -15 -17 0 -25 -6 -25 -17 0 -10 -8 -31 -18 -48 -17 -28 -17 -30 0 -47 10 -10 18 -28 18 -40 0 -18 6 -23 27 -25 15 0 32 -9 39 -18 12 -15 15 -15 43 5 16 13 37 20 45 17 12 -5 16 0 16 16 0 12 7 33 16 45 14 20 14 24 0 44 -9 12 -16 33 -16 46 0 16 -4 22 -14 19 -7 -3 -28 3 -45 14 -37 22 -33 22 -49 4z m58 -65 c23 -23 26 -49 7 -74 -16 -21 -60 -24 -82 -6 -33 27 -6 100 37 100 10 0 27 -9 38 -20z"/>
<path d="M1445 1630 c-8 -14 3 -30 21 -30 8 0 14 9 14 20 0 21 -24 28 -35 10z"/>
</g>
</svg><p className="text-lg">CodigoCreativo</p>
        </Link></div>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >

        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/" || pathname.includes("/")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/" ||
                            pathname.includes("dashboard")) &&
                          "bg-graydark dark:bg-meta-4"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >

                        Escritorio
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && "hidden"
                          }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                                href="/"
                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/" && "text-white"
                                }`}
                            >
                              Principal
                            </Link>
                          </li>
                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/equipos" || pathname.includes("/equipos")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("equipos")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg
                                            className="fill-current"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                              fill=""
                                          />
                                          <path
                                              d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                              fill="white"
                                          />
                                        </svg>
                                        Equipos
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/equipos/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Equipo
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/equipos"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Equipos
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/equipos/baja"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos/baja" &&
                                                "text-white"
                                                } `}
                                            >
                                              Equipos Inactivos
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>

                          <li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/ubicacion" || pathname.includes("/ubicacion")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("ubicacion")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg
                                            className="fill-current"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                              fill=""
                                          />
                                          <path
                                              d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                              fill="white"
                                          />
                                        </svg>
                                        Ubicaciones
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/ubicacion/createe"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Ubicación
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/ubicacion"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Ubicaciones
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                          </li>

                          <li>
                            {userPerfilId !== 4 && userPerfilId !== 21 && (
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/usuarios" || pathname.includes("forms")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("forms")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg
                                            className="fill-current"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                              fill=""
                                          />
                                          <path
                                              d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                              fill="white"
                                          />
                                        </svg>
                                        Usuarios
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/usuarios/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar Usuario
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/usuarios"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/usuarios" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Usuarios
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                            )}
                          </li>

                          <li>
                            {userPerfilId !== 4 && userPerfilId !== 21 && (
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === "/paises" || pathname.includes("/paises")
                                }
                            >
                              {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                      <Link
                                          href="#"
                                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                                              pathname.includes("paises")) &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sidebarExpanded
                                                ? handleClick()
                                                : setSidebarExpanded(true);
                                          }}
                                      >
                                        <svg
                                            className="fill-current"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                              fill=""
                                          />
                                          <path
                                              d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                              fill=""
                                          />
                                          <path
                                              d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                              fill="white"
                                          />
                                        </svg>
                                        Paises
                                        <svg
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                            }`}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                              fill=""
                                          />
                                        </svg>
                                      </Link>
                                      {/* <!-- Dropdown Menu Start --> */}
                                      <div
                                          className={`translate transform overflow-hidden ${!open && "hidden"
                                          }`}
                                      >
                                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                          <li>
                                            <Link
                                                href="/paises/create"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos/create" &&
                                                "text-white"
                                                }`}
                                            >
                                              Agregar País
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                                href="/paises"
                                                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/equipos" &&
                                                "text-white"
                                                } `}
                                            >
                                              Ver Paises
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                              }}
                            </SidebarLinkGroup>
                                )}
                          </li>

                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Dashboard --> */}
              {/* <!-- Menu Item Forms --> */}


              {/* <!-- Menu Item Settings --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Chart --> */}

              {/* <!-- Menu Item Chart --> */}

              {/* <!-- Menu Item Ui Elements --> */}

              {/* <!-- Menu Item Ui Elements --> */}

              {/* <!-- Menu Item Auth Pages --> */}
              <SidebarLinkGroup
                  activeCondition={
                      pathname === "/auth" || pathname.includes("auth")
                  }
              >
                {(handleClick, open) => {
                  return (
                      <React.Fragment>
                        <Link
                            href="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/auth" || pathname.includes("auth")) &&
                            "bg-graydark dark:bg-meta-4"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                            }}
                        />

                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                            className={`translate transform overflow-hidden ${!open && "hidden"
                            }`}
                        >
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Auth Pages --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
