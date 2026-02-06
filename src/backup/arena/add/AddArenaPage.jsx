"use client"
import { useState } from "react";
import { RingLoader } from "react-spinners";
import insertArena from "./insertArena";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default ({ user, university }) => {
    const [name, setName] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [pricing, setPricing] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentAccount, setPaymentAccount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();


    const fakeSubmit = async () => {
        setIsSubmitting(true);
        const data = {
            name,
            batch_no: batchNo,
            pricing,
            payment_method: paymentMethod,
            payment_acount_number: paymentAccount,
        };
        const res = await insertArena(data);
        if (res && res.success) {
            toast.success("Arena created successfully!");
            router.replace("/arena/" + res.arenaId);
        } else {
            if (res && res.error) {
                toast.error("Insert Arena Error:", res.error);
            } else {
                toast.error("Insert Arena Error: Unknown error occurred.");
            }
            setTimeout(() => {
                setIsSubmitting(false);
            }, 250);
        }
    };

    return (
        <div className="mt-8 flex items-center justify-center  p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Arena</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input className="border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-gray-300 select-none" type="text" placeholder="Payment Account" value={university?.name} readOnly disabled />
                    <input className="border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" type="text" placeholder="Batch No" value={batchNo} onChange={e => setBatchNo(e.target.value)} />
                    <input className="border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" type="text" placeholder="Arena Name" value={name} onChange={e => setName(e.target.value)} />
                    <input className="border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" type="text" placeholder="Pricing" value={pricing} onChange={e => setPricing(e.target.value)} />
                    <select className="border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" type="text" placeholder="Payment Method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} >
                        <option value={""} disabled>Payment Method</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="rocket">Rocket</option>
                        <option value="upay">Upay</option>
                    </select>
                    <input className="border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition" type="text" placeholder="Account Number" value={paymentAccount} onChange={e => setPaymentAccount(e.target.value)} />
                </div>
                <div className="h-[40px] mt-6 ">
                    {isSubmitting ?
                        <RingLoader color="#7e22ce" size={40} className="mx-auto" />
                        :
                        <button onClick={fakeSubmit} className="w-full cursor-pointer bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-2xl transition-all shadow-lg transform hover:scale-105">
                            Submit Arena
                        </button>}
                </div>
            </div>
        </div>
    );
}