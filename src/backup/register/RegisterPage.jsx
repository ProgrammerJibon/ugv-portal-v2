"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SplashScreen from "@/Components/SplashScreen";
import { getCountries, getUniversities } from "../json/serverFunctions";
import { RingLoader } from "react-spinners";
import { registerUser } from "./registerUser";
import resizeImage from "./resizeImage";
import { toast } from "react-toastify";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [countryShortCode, setCountryShortCode] = useState("");
    const [universityId, setUniversityId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [userType, setUserType] = useState("0");
    const [loading, setLoading] = useState(true);
    const [universityLoading, setUniversityLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);



    useEffect(() => {
        // console.log("Register page loaded");
        (async () => {
            const countriesResponse = await getCountries();
            setCountries(countriesResponse);

        })().finally(() => setTimeout(() => setLoading(false), 100));
    }, []);


    useEffect(() => {        
        if (countryShortCode) {
            (async () => {
                setUniversityLoading(true);
                const resUniversities = await getUniversities(countryShortCode);
                // console.log(resUniversities);
                setUniversities(resUniversities);
            })().finally(() => setTimeout(() => setUniversityLoading(false), 100));
        }
    }, [countryShortCode]);


    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) return;

        const resized = await resizeImage(file);
        setImageFile(resized);
        setImagePreview(URL.createObjectURL(resized));
    };


    const handleRegister = async (e) => {
        setIsRegistering(true);
        e.preventDefault();
        setMessage("");


        try{
            if (!name || !phone || !countryShortCode || !universityId || !password || !confirmPassword) {
                setMessage("Please fill all fields");
                return;
            }

            if (userType === "0" && !studentId) {
                setMessage("Student ID is required");
                return;
            }

            if (password !== confirmPassword) {
                setMessage("Passwords do not match");
                return;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("countryShortCode", countryShortCode);
            formData.append("universityId", universityId);
            formData.append("studentId", studentId || "");
            formData.append("password", password);
            formData.append("userType", userType === "0" ? "STUDENT" : "TEACHER");

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await registerUser(formData);

            if (!res || !res.success) {
                setMessage(res?.error || "Registration failed");
                setIsRegistering(false);
                // setTimeout(()=>setMessage(""), 3000);
                return;
            }
            setMessage("Registration successful. Redirecting to login page...");
            toast.success("Registration successful. Moving to login page.");
            setTimeout(() => {
                setIsRegistering(false);
                window.location.href = "/login";
            }, 1000);
        }finally{
            setIsRegistering(false);
        }
        
    };



    

    // Sort arrays once
    const publicUniversities = "public" in universities ? [...universities.public].sort((a, b) =>
        a.name.localeCompare(b.name)
    ) : [];
    const privateUniversities = "private" in universities ? [...universities.private].sort((a, b) =>
        a.name.localeCompare(b.name)
    ) : [];

    const groupedOptions = [
        {
            label: "Public Universities",
            options: publicUniversities.map((univ) => ({
                value: univ.id,
                label: univ.name
            }))
        },
        {
            label: "Private Universities",
            options: privateUniversities.map((univ) => ({
                value: univ.id,
                label: univ.name
            }))
        }
    ];

    // console.log(countries);
    // retruns: [
    //     {
    //         "name": "Australia",
    //         "short_code": "AU",
    //         "flag_url": "https://flagcdn.com/au.svg",
    //         "phone_min_length": "9",
    //         "phone_max_length": "9"
    //     },


    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 bg-fixed px-4 py-10">
            {loading && <SplashScreen />}

            <form
                hidden={loading}
                onSubmit={handleRegister}
                className="relative flex flex-col max-w-2xl w-full mx-auto items-center backdrop-blur-xl bg-white/10 p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 space-y-4"
            >
                {/* Decorative background glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-30"></div>

                <h1 className="text-3xl font-extrabold text-white tracking-tight">BrainSolve{"\t|\t"}Create Account</h1>

                {/* Profile Pic Upload */}
                <div
                    onClick={() => document.getElementById("imageInput").click()}
                    className="group relative w-24 h-24 border-2 border-dashed border-white/30 rounded-full cursor-pointer flex items-center justify-center overflow-hidden hover:border-blue-400 transition-all duration-300 bg-white/5"
                >
                    {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-center px-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-white/60 group-hover:text-blue-400">
                                Upload Photo
                            </span>
                        </div>
                    )}
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageSelect}
                    />
                </div>

                {}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1">
                        <Select
                            value={{ value: userType, label: userType === "0" ? "Student" : "Teacher" }}
                            onChange={(selected) => setUserType(selected.value)}
                            options={[
                                { value: "0", label: "Student" },
                                { value: "1", label: "Teacher" }
                            ]}
                            placeholder="User Type"
                            className="modern-select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    borderColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "12px",
                                    height: "48px",
                                    color: "white",
                                    width: (userType === "0" ? "110%" : "100%"),
                                }),
                                singleValue: (base) => ({ ...base, color: "white" }),
                                menu: (base) => ({ ...base, backgroundColor: "#1e293b", color: "white" }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? "#3b82f6" : "transparent",
                                })
                            }}
                        />
                    </div>
                    {userType === "0" && (
                        <input
                            type="text"
                            placeholder="Student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="flex-1 ml-6 bg-white/5 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            autoComplete="off"
                            required
                        />
                    )}
                </div>

                {/* Row 2: Full Name & Phone */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        autoComplete="off"
                        required
                    />
                    <input
                        type="phone"
                        autoComplete="username"
                        placeholder="Phone (01XXXXXXXXX)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        pattern="^01[3-9][0-9]{8}$"
                        required
                    />
                </div>

                {/* Row 3: Country & University */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1">
                        <Select
                            onChange={(selected) => setCountryShortCode(selected.value)}
                            options={countries.map((country) => ({
                                value: country.short_code,
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <img src={country.flag_url} alt={country.name} className="w-5 h-3 object-cover rounded-sm" />
                                        <span>{country.name}</span>
                                    </div>
                                )
                            }))}
                            placeholder="Country"
                            isSearchable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    borderColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "12px",
                                    height: "48px",
                                }),
                                singleValue: (base) => ({ ...base, color: "white" }),
                                menu: (base) => ({ ...base, backgroundColor: "#1e293b" })
                            }}
                        />
                    </div>
                    <div className="flex-1 relative">
                        {universityLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/50 rounded-xl">
                                <RingLoader size={24} color="#36d7b7" />
                            </div>
                        )}
                        <Select
                            onChange={(selected) => setUniversityId(selected.value)}
                            options={groupedOptions}
                            placeholder="University"
                            isSearchable
                            className={universityLoading ? "opacity-0" : "opacity-100"}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    borderColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "12px",
                                    height: "48px",
                                }),
                                singleValue: (base) => ({ ...base, color: "white" }),
                                menu: (base) => ({ ...base, backgroundColor: "#1e293b" })
                            }}
                        />
                    </div>
                </div>

                {/* Row 4: Password Fields */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        autoComplete="new-password"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        autoComplete="new-password"
                        required
                    />
                </div>

                {message && (
                    <div className="w-full p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-200 text-sm text-center font-medium">{message}</p>
                    </div>
                )}

                {/* Submit Section */}
                <div className="w-full flex h-[60px] flex-col items-center my-4">
                    {isRegistering ? (
                        <RingLoader color="#60a5fa" size={60} />
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
                        >
                            Register
                        </button>
                    )}
                </div>

                <div className="flex space-x-2 text-sm">
                    <span className="text-white/60">Already have an account?</span>
                    <Link href="/login" className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors">
                        Login here
                    </Link>
                </div>

                
            </form>
        </div>
    );
}
