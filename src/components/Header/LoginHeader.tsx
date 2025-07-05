import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import Image from "next/image";

const LoginHeader = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    return (
        <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "!w-full delay-300"
                    }`}
                ></span>
                <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "delay-400 !w-full"
                    }`}
                ></span>
                <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "!w-full delay-500"
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "!h-0 !delay-[0]"
                    }`}
                ></span>
                <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                        !props.sidebarOpen && "!h-0 !delay-200"
                    }`}
                ></span>
              </span>
            </span>
                    </button>
                    {/* <!-- Hamburger Toggle BTN --> */}

                    <Link className="block flex-shrink-0 lg:hidden" href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" className="dark:bg-white dark:rounded-full" version="1.0" width="32px" height="32px" viewBox="0 0 324.000000 324.000000" preserveAspectRatio="xMidYMid meet">

<g transform="translate(-155.000000,552.000000) scale(0.20000,-0.200)" fill="#000000" stroke="none">
<path d="M1491 2740 c-470 -64 -782 -507 -681 -965 61 -276 260 -497 530 -588 90 -30 169 -40 288 -35 139 6 255 40 372 110 260 154 416 466 382 763 -25 219 -119 397 -285 536 -161 136 -402 206 -606 179z m504 -604 c0 -199 -3 -260 -12 -263 -10 -4 -13 35 -13 171 l0 176 -415 0 -415 0 2 -292 3 -293 63 -3 c44 -2 62 -7 59 -15 -2 -8 -30 -12 -83 -12 l-79 0 -3 375 c-1 206 0 385 3 398 l5 22 443 -2 442 -3 0 -259z m-341 5 c5 -8 -139 -247 -172 -284 -10 -11 -19 -14 -25 -8 -6 6 8 38 39 88 133 216 143 229 158 204z m-244 -35 c0 -8 -21 -35 -46 -61 l-47 -46 47 -48 c46 -46 57 -71 34 -71 -15 0 -118 100 -118 114 0 12 111 126 122 126 4 0 8 -6 8 -14z m364 -45 c66 -67 66 -68 -7 -140 -33 -31 -51 -42 -63 -37 -15 6 -10 14 29 54 26 26 47 52 47 56 0 5 -20 31 -46 58 -39 42 -49 68 -26 68 4 0 34 -26 66 -59z m164 -206 c6 -33 19 -40 47 -25 23 12 28 11 55 -15 30 -29 39 -58 20 -70 -15 -9 0 -33 26 -39 21 -6 24 -12 24 -56 0 -42 -3 -50 -19 -50 -26 0 -48 -27 -33 -42 20 -20 14 -43 -18 -73 -26 -25 -33 -28 -50 -17 -29 18 -39 15 -50 -13 -12 -32 -30 -39 -75 -31 -25 5 -35 12 -35 26 0 27 -18 34 -46 19 -22 -11 -27 -10 -59 21 -32 31 -34 36 -21 55 17 26 4 55 -24 55 -17 0 -20 7 -20 50 0 44 3 50 24 56 26 6 41 30 26 39 -19 12 -10 41 20 70 27 26 32 27 54 16 28 -15 46 -8 46 18 0 27 10 32 60 29 36 -2 46 -7 48 -23z m-432 -90 c4 -9 19 -15 35 -15 32 0 63 -37 53 -64 -4 -10 0 -18 10 -22 23 -9 23 -84 0 -84 -12 0 -15 -6 -10 -23 7 -31 -33 -72 -62 -63 -15 5 -22 1 -27 -14 -9 -27 -70 -28 -85 -1 -6 13 -17 17 -30 14 -29 -8 -63 25 -55 54 4 16 -1 25 -15 33 -27 15 -27 65 0 80 15 8 19 17 15 31 -9 28 21 59 55 59 16 0 30 7 34 15 3 9 19 15 41 15 22 0 38 -6 41 -15z"/>
<path d="M1140 2310 l0 -50 415 0 415 0 0 50 0 50 -415 0 -415 0 0 -50z m60 5 c0 -8 -4 -15 -9 -15 -13 0 -22 16 -14 24 11 11 23 6 23 -9z m67 -11 c-9 -9 -28 6 -21 18 4 6 10 6 17 -1 6 -6 8 -13 4 -17z m70 0 c-9 -9 -28 6 -21 18 4 6 10 6 17 -1 6 -6 8 -13 4 -17z"/>
<path d="M1863 1821 c-6 -23 -56 -43 -88 -35 -26 6 -42 -11 -27 -29 14 -16 -10 -72 -37 -87 -24 -12 -28 -40 -6 -40 23 0 47 -45 43 -82 -3 -30 -1 -33 22 -31 40 3 87 -16 93 -37 7 -26 37 -26 44 -1 6 24 56 43 91 34 23 -5 24 -4 20 22 -8 40 10 85 38 95 29 12 31 30 4 37 -27 7 -53 68 -40 93 12 22 -2 35 -27 26 -25 -10 -80 13 -86 34 -7 26 -37 26 -44 1z m85 -117 c48 -54 11 -136 -62 -136 -99 0 -120 130 -26 165 26 10 64 -3 88 -29z"/>
<path d="M1844 1679 c-17 -19 -17 -23 -3 -47 27 -49 89 -37 89 17 0 51 -51 69 -86 30z"/>
<path d="M1442 1725 c-7 -8 -24 -15 -37 -15 -17 0 -25 -6 -25 -17 0 -10 -8 -31 -18 -48 -17 -28 -17 -30 0 -47 10 -10 18 -28 18 -40 0 -18 6 -23 27 -25 15 0 32 -9 39 -18 12 -15 15 -15 43 5 16 13 37 20 45 17 12 -5 16 0 16 16 0 12 7 33 16 45 14 20 14 24 0 44 -9 12 -16 33 -16 46 0 16 -4 22 -14 19 -7 -3 -28 3 -45 14 -37 22 -33 22 -49 4z m58 -65 c23 -23 26 -49 7 -74 -16 -21 -60 -24 -82 -6 -33 27 -6 100 37 100 10 0 27 -9 38 -20z"/>
<path d="M1445 1630 c-8 -14 3 -30 21 -30 8 0 14 9 14 20 0 21 -24 28 -35 10z"/>
</g>
</svg>
                    </Link>
                </div>

                <div className="hidden sm:block">

                </div>

                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        {/* <!-- Dark Mode Toggler --> */}
                        <DarkModeSwitcher />
                        {/* <!-- Dark Mode Toggler --> */}
                    </ul>


                </div>
            </div>
        </header>
    );
};

export default LoginHeader;
