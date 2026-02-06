"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "@/assets/logo.png"
import Image from "./Image";

export default ({ gUser }) => {
    if (!gUser || !("user" in gUser)) return null;
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNavBarShown, setIsNavBarShown] = useState(true);
    const [user, setUser] = useState(gUser && "user" in gUser ? gUser.user : null);
    const [profileSnapDropdownVisible, setProfileSnapDropdownVisible] = useState(false);

    // console.log(logo);



    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            setIsMenuOpen(false);
            setProfileSnapDropdownVisible(false);
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current) {
                // console.log("down");
                setIsNavBarShown(false);
            } else if (currentScrollY < lastScrollY.current) {
                // console.log("up");
                setIsNavBarShown(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    useEffect(()=>{
        setIsMenuOpen(false);
    }, [pathname])



    const ProfileSnapView = () => {
        return (
            <div
                className={`w-10 h-10 rounded-full overflow-hidden border-2 ${profileSnapDropdownVisible ? "hover:border-red-500 border-red-600 " : "border-gray-300 hover:border-red-600"}  cursor-pointer`}
                title={user?.name || "User"}
                onClick={() => setProfileSnapDropdownVisible(!profileSnapDropdownVisible)}
            ><Image
                    src={user.pic}
                    alt={user?.name}
                    className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                />

            </div>
        );
    }

    const ProfileSnapDropdownLi = () => {
        return <>
            <li>
                <Link href={"/profile/" + user?.id} className="inline-block px-6 py-2 hover:text-red-500 cursor-pointer">{user?.name}</Link>
            </li>
            <li >
                <Link href={"/settings"} className="inline-block px-6 hover:text-red-500 cursor-pointer ">Settings</Link>
            </li>
            <li>
                <form action="/logout" method="POST" className="block">
                    <button type="submit" name="logout" value={1} className="inline-block px-6 py-2 hover:text-red-500 cursor-pointer">Logout ({user?.name?.slice(0, 10)?.trim()})</button>
                </form>
            </li>
        </>;
    }
    // console.log(pathname);


    return (
        <nav className={`w-full bg-white shadow sticky  left-0 z-50 transition-all delay-300 duration-[5s] ease-in-out  ${isNavBarShown ? "top-[0px]" :"top-[-120px]"} `}>
            <div className="w-10/12 mx-auto px-6 py-4 flex items-center justify-between">
                <Link href={"/"} className="flex items-center gap-3">
                    <img src={logo.src} className="h-[64px]" />
                </Link>

                <ul className={`lg:flex items-center gap-10 text-gray-800 font-medium
                    ${isMenuOpen ? "block" : "hidden"} 
                    absolute lg:static top-[64px] left-0 w-full lg:w-auto bg-white lg:bg-transparent lg:block`}
                >
                    <li className="px-6 py-2 lg:p-0">
                        <Link href={"/dashboard"} className={` ${pathname == "/dashboard" && "text-red-500 font-bold"} `}>Dashboard</Link>
                    </li>
                    <li className="px-6 py-2 lg:p-0">
                        <Link href={"/arena"} className={` ${pathname.includes("/arena") && "text-red-500 font-bold"} `}>Arena List</Link>
                    </li>
                    <li className="max-lg:block hidden">
                        <ul><ProfileSnapDropdownLi /></ul>
                    </li>

                </ul>

                <div className="hidden lg:block relative" tabIndex={0} onBlur={() => {
                    setTimeout(() => {
                        setProfileSnapDropdownVisible(false);
                    }, 200);
                }}>
                    <ProfileSnapView />
                    <ul className={`mt-2 w-max max-lg:hidden border rounded bg-white shadow-lg absolute right-0 ${profileSnapDropdownVisible ? "block" : "hidden"}`}>
                        <ProfileSnapDropdownLi />
                    </ul>
                </div>

                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-gray-800 text-2xl">
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
        </nav>
    );
};
