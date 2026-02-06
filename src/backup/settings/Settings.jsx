"use client";

import { useState } from "react";
import { RingLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera, FaGoogle, FaUserShield, FaUniversity, FaIdCard } from "react-icons/fa";
import { updateBasicInfo, updateEmail, updatePassword, updateProfilePic } from "./changeUserDetails";
import Image from "@/Components/Image";
import resizeImage from "../register/resizeImage";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import googleCloudSecret from "@/context/client_secret_497545261562-tekkk50sjbdn8t72s6gksngsk4ofnqt2.apps.googleusercontent.com.json"
import { jwtDecode } from "jwt-decode";

export default function Settings({ user }) {
    const [name, setName] = useState(user.name || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [pic, setPic] = useState(user.pic || null);

    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);
    const [loadingPic, setLoadingPic] = useState(false);
    const [myEmail, setMyEmail] = useState(user.email || "");


    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        setLoadingInfo(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);

        const res = await updateBasicInfo(formData);

        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.error);
        }
        setLoadingInfo(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoadingPass(true);
        const formData = new FormData();
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);

        const res = await updatePassword(formData);

        if (res.success) {
            toast.success(res.message);
            setPassword("");
            setConfirmPassword("");
        } else {
            toast.error(res.error);
        }
        setLoadingPass(false);
    };



    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        setLoadingPic(true);

        // resize image like register page
        const resizedFile = await resizeImage(file);

        // show preview
        setPic(URL.createObjectURL(file));

        console.log(resizedFile);


        const formData = new FormData();
        formData.append("image", resizedFile);

        try {
            const res = await updateProfilePic(formData);

            if (res.success) {
                setPic(res.url);

                toast.success("Profile picture updated");

            } else {
                toast.error(res.error);
            }
        } finally {
            setLoadingPic(false);
        }


    };




    const handleGoogleLogin = async (credentialResponse) => {
        try{
            const response = jwtDecode(credentialResponse.credential);
            if(("email" in response)){
                setMyEmail(response.email);
                const formData = new FormData();
                formData.append("email", response.email);

                const resEmail = await updateEmail(formData);
                if (resEmail.success) {
                    toast.success(resEmail.message);
                } else {
                    toast.error(resEmail.error);
                }   
            }else{
                toast.error("Unauthorized google account!!!");
            }
        }catch (e){
            console.log(e);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-32 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-5xl mx-auto space-y-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your profile information and security.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="md:col-span-1 space-y-6">

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
                            <div className="relative group cursor-pointer">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner">
                                    <Image
                                        src={pic || "/avatar.png"}
                                        alt={user.name}
                                        className="w-full h-full object-cover text-gray-500  bg-gray-200 text-5xl"
                                    />
                                </div>
                                <div
                                    onClick={() => loadingPic || document.getElementById('picInput').click()}
                                    className={`absolute inset-0 ${loadingPic && "opacity-100"} bg-black/50 bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                                >
                                    {loadingPic ?
                                        <RingLoader color="white" /> :
                                        <FaCamera className="text-white text-2xl" />
                                    }
                                </div>
                                <input
                                    type="file"
                                    id="picInput"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.name}</h2>
                            <span className="px-3 py-1 mt-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {user.user_type}
                            </span>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <FaIdCard className="text-gray-400" /> Academic Info
                            </h3>
                            <dl className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <dt className="text-gray-500">University</dt>
                                    <dd className="font-medium text-gray-900 text-right">{user.university_id || "N/A"}</dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <dt className="text-gray-500">Student ID</dt>
                                    <dd className="font-medium text-gray-900">{user.university_student_id || "N/A"}</dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <dt className="text-gray-500">System ID</dt>
                                    <dd className="font-medium text-gray-900">#{user.id}</dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <dt className="text-gray-500">Country</dt>
                                    <dd className="font-medium text-gray-900">{user.country_short_code}</dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <dt className="text-gray-500">Account Created</dt>
                                    <dd className="font-medium text-gray-900 text-xs">
                                        <div>{new Date(parseInt(user.req_time) * 1000).toLocaleDateString()}</div>
                                        <div>{new Date(parseInt(user.req_time) * 1000).toLocaleTimeString()}</div>
                                    </dd>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <dt className="text-gray-500">Status</dt>
                                    <dd className={`font-medium ${user.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {user.status}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Details</h3>
                            <form onSubmit={handleInfoUpdate} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            pattern="^01[3-9][0-9]{8}$"
                                            title="Must be a valid BD phone number (e.g., 01712345678)"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loadingInfo}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50"
                                    >
                                        {loadingInfo ? <RingLoader size={18} color="#fff" /> : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Address</h3>
                            <div className="flex flex-col  items-start  justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="break-all">
                                    <p className="text-sm text-gray-500">Current Email</p>
                                    <p className="font-medium text-gray-900">{myEmail || "No email connected"}</p>
                                </div>
                                
                                <GoogleOAuthProvider clientId={googleCloudSecret.web.client_id} >
                                    <div className="mx-auto w-full overflow-hidden  pb-4 google-btn">
                                        <GoogleLogin
                                            width={"100%"}
                                            text="Connect Google Account"
                                            shape="pill"
                                            theme="filled_blue"
                                            onSuccess={handleGoogleLogin}
                                            onError={() => {}}
                                        />
                                    </div>
                                </GoogleOAuthProvider>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 ml-1">
                                * Your email can only be updated by verifying with your Google account.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaUserShield /> Security
                            </h3>
                            <form onSubmit={handlePasswordUpdate} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loadingPass || !password}
                                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-black transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingPass ? <RingLoader size={18} color="#fff" /> : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}