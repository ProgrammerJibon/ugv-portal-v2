import { useEffect, useState } from "react";
import getArenaStandings from "./getArenaStandings";
import TableClickSubmissionDetails from "./[problemId]/submission/TableClickSubmissionDetails";
import Image from "@/Components/Image";
import Link from "next/link";
import { makeNumber } from "@/app/functions";

export default function ArenaStandings({ arenaId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const loadData = async ()=>{
        const res = await getArenaStandings(arenaId);
        setData(res);
        setTimeout( async ()=>{
            await loadData();
        }, 3000);
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            await loadData();
            setLoading(false);
        })();
    }, [arenaId]);

    const formatTime = t =>
        t ? new Date(Number(t) * 1000).toLocaleTimeString("en-BD") : "";

    if (loading) return <div className="p-10">Loading...</div>;
    if (!data) return null;

    return (
        <div className="overflow-x-auto border border-gray-300 rounded-lg h-[70vh] overflow-y-auto">
            <table className="min-w-full text-sm text-left h-full">
                <thead className="bg-gray-100 ">
                    <tr className="sticky top-0 bg-gray-100 z-10">
                        <th className="px-4 py-2 text-center">#</th>
                        <th className="px-4 py-2 sticky left-0 bg-gray-100">User</th>
                        {data.problems.map((pid, ix) => (
                            <th key={pid} className="px-4 py-2 text-center">
                                P{ix+1}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="">
                    {data.users.map((u, i) => (
                        <tr key={u.user_id} className="border-b hover:bg-gray-50 border border-gray-200">
                            <td className="px-4 py-2 text-center">#{i + 1}</td>
                            <td className="sticky left-0 bg-white">
                                <div className="px-4 py-2 min-w-max flex items-center gap-3">
                                    <Link href={"/profile/" + u.user_id} target="_blank" className=" hover:opacity-50">
                                        <Image src={u.user_pic} alt={u.name} className={"w-8 h-8 bg-gray-300 rounded-full overflow-hidden"} />
                                    </Link>
                                    <div>
                                        <Link href={"/profile/" + u.user_id} target="_blank" className=" hover:opacity-50 font-semibold">{u.user_id}. {u.user_name}</Link>
                                        <div className="text-xs text-gray-500">
                                            {u.university_id}#{u.university_student_id}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            {data.problems.map(pid => {
                                const prob = u.problems[pid];
                                const sub = prob?.firstAccepted || prob?.lastFailed;
                                const isAccepted = prob?.firstAccepted ? true : false;

                                if (!sub) return <td key={pid}></td>; // no submission for this problem

                                return (
                                    <td
                                        key={pid}
                                        className={`px-4 py-2 text-center cursor-pointer text-xs ${isAccepted ? "bg-green-100 hover:bg-green-200 font-semibold" : "bg-red-100 hover:bg-red-200 font-semibold"
                                            }`}
                                        onClick={() => setSelectedSubmission(sub)}
                                    >
                                        {new Date(Number(sub.submitted_on) * 1000).toLocaleTimeString("en-BD")}
                                    </td>
                                );
                            })}

                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedSubmission && (
                <TableClickSubmissionDetails
                    selectedSubmission={selectedSubmission}
                    setSelectedSubmission={setSelectedSubmission}
                />
            )}

        </div>
    );
}
