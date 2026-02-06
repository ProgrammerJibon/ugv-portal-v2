"use client"
import { BarLoader } from "react-spinners"

export default ({}) => {
    return <div className="fixed top-0 h-screen w-full bg-black/90 backdrop-blur-sm flex flex-col justify-center items-center z-50">
        <BarLoader color="white" />
        <div className="text-white mt-2">Loading...</div>
    </div>
}