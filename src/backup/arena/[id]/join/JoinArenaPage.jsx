"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import joinArena from "./joinArena"; // your server function
import checkIfArenaUser from "@/app/json/serverFunctions";
import SplashScreen from "@/Components/SplashScreen";

export default function JoinArenaPage({ user, arenaDetails }) {


    const { id } = useParams();

    if(!id){
        return <div className="w-10/12 mx-auto mt-16 mb-32 max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Invalid Arena ID</h1>
        </div>
    }

    const [joined, setJoined] = useState(true);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        payment_txn_id: "",
        payment_by_number: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData, arena_id: id };
            const res = await joinArena(payload);
            if (res.success) {
                toast.success("Successfully joined arena!");
                setTimeout(() => {
                    window.location.href = `/arena/${id}`;
                }, 500);
            } else {
                toast.error(res.error || "Unknown error occurred.");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        (async ()=>{
            const arenaJoinCheck = await checkIfArenaUser(id, user?.id);
            if(arenaJoinCheck){
                if (arenaJoinCheck.status == "PENDING") {
                    toast.info("Your request to join this arena is still pending approval.");
                    setJoined(true);
                    setTimeout(() => {
                        window.location.href = `/arena/${id}`;
                    }, 1000);
                }else if(arenaJoinCheck.status == "APPROVED"){
                    setJoined(true);
                    setTimeout(() => {
                        setLoading(true);
                    }, 100);
                    window.location.href = `/arena/${id}`;
                }else if(arenaJoinCheck.status == "DECLINED"){
                    toast.error("Your request to join this arena has been declined, try again.");
                    setJoined(false);
                }
                
            }else{
                setJoined(false);
            }
        })().finally(()=>{
            setLoading(false);
        });
    }, [id]);


    if(loading){
        return <SplashScreen />;
    }

    if(joined){
        return (
            <div className="w-10/12 mx-auto mt-16 mb-32 max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">You have already joined Arena ID: {id}</h1>
            </div>
        );
    }


    return (
        <div className="w-10/12 mx-auto mt-16 mb-32 max-w-md">
            {/* <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Join Arena</h1> */}

            {arenaDetails && (
                <div className="mb-8 p-6 rounded-xl shadow-lg bg-gradient-to-r from-blue-50 to-white border border-gray-200">
                    <h2 className="text-xl font-bold text-blue-700 mb-2">{arenaDetails.name}</h2>
                    <div className="text-gray-700 space-y-1">
                        <p><span className="font-semibold">batch no:</span> {arenaDetails?.batch_no}</p>
                        <p><span className="font-semibold">University:</span> {arenaDetails?.university?.name}</p>
                        <p><span className="font-semibold">Teacher:</span> {arenaDetails?.userDetails?.name}</p>
                        {arenaDetails.pricing && <p><span className="font-semibold">Price:</span> {arenaDetails.pricing}</p>}
                        {arenaDetails.payment_acount_number && <p><span className="font-semibold">Pay to:</span> {arenaDetails.payment_acount_number} ({arenaDetails.payment_method})</p>}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-gray-300">
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Payment Transaction ID</label>
                    <input
                        type="text"
                        name="payment_txn_id"
                        value={formData.payment_txn_id}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Paid By Number</label>
                    <input
                        type="text"
                        name="payment_by_number"
                        value={formData.payment_by_number}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                    {submitting ? "Joining..." : "Join Arena"}
                </button>
            </form>
        </div>
    );

}
