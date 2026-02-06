"use client";
import SplashScreen from "@/Components/SplashScreen";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import getArenaDetails from "./getArenaDetails";
import Link from "next/link";
import getArenaProblemsSet from "./getArenaProblemsSet";
import checkIfArenaUser from "@/app/json/serverFunctions";
import setStatus from "./setStatus";
import setCodesShown from "./setCodesShown";
import ArenaStandings from "./ArenaStandings";
import { IoMdClose, IoMdDoneAll } from "react-icons/io";


export default function ArenaPage({ user }) {
    const { id } = useParams();
    const [dataOfArena, setDataOfArena] = useState(null);
    const [problemSets, setProblemSets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isArenaUser, setIsArenaUser] = useState(false);
    const [isArenaUserPending, setIsArenaUserPending] = useState(false);


    const fetchUpdate = async () => {
        setLoading(true);

        let arenaData = null;
        (async () => {
            arenaData = await getArenaDetails(id);

            setDataOfArena(arenaData);
        })().then(async () => {
            await (async () => {

                const checkIfArenaUserRes = await checkIfArenaUser(id, user.id);
                if (checkIfArenaUserRes || arenaData?.created_by == user?.id || user.user_type == "ADMIN") {
                    if (checkIfArenaUserRes?.status == "APPROVED" || arenaData?.created_by == user?.id || user.user_type == "ADMIN") {
                        setIsArenaUser(true);
                        const problemSetsData = await getArenaProblemsSet(id, user.id);
                        // console.log(problemSetsData);

                        setProblemSets(problemSetsData);
                    } else if (checkIfArenaUserRes.status == "PENDING") {
                        setIsArenaUserPending(true);
                        setProblemSets([]);
                    } else {
                        setProblemSets([]);
                    }
                }
            })();
        }).finally(() => {
            setLoading(false);
        });
    }
    useEffect(() => {

        fetchUpdate();

    }, [id]);


    if (loading) return <SplashScreen />;
    if (!dataOfArena) return <div className="p-10 text-red-600">Arena not found</div>;

    const { name, id: arena_id, created_by, created_on, country_code, batch_no, pricing, payment_method, payment_acount_number, status, comment, university, userDetails } = dataOfArena;

    return (
        <div className="p-10 space-y-2 w-10/12 mx-auto mb-32">

            <h1 className="text-3xl font-bold">{arena_id}. {name}</h1>
            <div className="text-red-500">{status.toLowerCase() == "closed" && "Submission is closed now"}</div>
            <ul className="list-disc list-inside space-x-4 flex flex-wrap ">
                <li><b>Batch No:</b> {batch_no}</li>
                <li><b>University Country Code:</b> {university.country_short_code}</li>
                <li><b>University:</b> {university.name} ({university.id})</li>
                <li><b>University Type:</b> {university.varsity_type}</li>
                {/* <li><b>Cost ({country_code}):</b> {pricing}</li>
                <li><b>Payment Method:</b> {payment_method}</li>
                <li><b>Payment Account:</b> {payment_acount_number}</li> */}
                {/* <li><b>Created By:</b> {userDetails?.name}</li>
                <li><b>Created On:</b> {new Date(created_on * 1000).toLocaleString()}</li> */}
            </ul>
            <div className="flex space-x-2">
                {(user.user_type == "STUDENT" || user.user_type == "ADMIN") && !isArenaUser && !isArenaUserPending && <Link
                    href={"/arena/" + id + "/join"}
                    className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 "
                >
                    Join Arena
                </Link>}
                {((user.user_type == "TEACHER" && user?.id == created_by) || user.user_type == "ADMIN") && <>
                    <Link
                        href={"/arena/" + id + "/add-problems-set"}
                        className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 "
                    >
                        Add Problems Set
                    </Link>
                    <Link
                        href={"/arena/" + id + "/students"}
                        className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 "
                    >
                        Students List
                    </Link>
                    <button
                        onClick={async () => {
                            const res = await setStatus(id, status.toLowerCase() == "closed" ? "ACTIVE" : "CLOSED");
                            if (res) {
                                await fetchUpdate();
                            }
                        }}
                        className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 "
                    >
                        {status.toLowerCase() == "closed" ? "OPEN" : "CLOSE"}
                    </button>
                    <button
                        onClick={async () => {
                            const res = await setCodesShown(id, dataOfArena?.codes_shown == "0" ? "1" : "0");
                            if (res) {
                                await fetchUpdate();
                            }
                        }}
                        className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 "
                    >
                        {dataOfArena?.codes_shown == "0" ? "SHOW CODES" : "HIDE CODES"}
                    </button>
                </>}
            </div>

            <div>
                {!isArenaUserPending ? (
                    isArenaUser && (
                        problemSets == null ? (
                            <p className="text-center text-gray-500 mt-6">Loading problem sets...</p>
                        ) : problemSets.length === 0 ? (
                            <p className="text-center text-gray-500 mt-6">No problem sets found.</p>
                        ) : (
                            <div className="">
                                <h1 className="text-2xl font-bold mt-6 mb-4">Problem Sets</h1>
                                <ul className="space-y-4 h-[70vh] overflow-y-auto bg-gray-100 rounded-lg p-4 border border-gray-300 shadow-lg">
                                    {problemSets.toReversed().map((problem, index) => (
                                        <Link href={`/arena/${dataOfArena?.id}/${problem?.id}`} key={problem.id} className="block">
                                            <li className="flex items-center justify-between bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-blue-300">
                                                <div className="px-6 py-6 flex-1">
                                                    <h3 className={`text-lg font-semibold ${problem.passed ? "text-green-700" : "text-gray-700"}`}>
                                                        <span>{index + 1}. </span>
                                                        {problem.ProblemName}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                                                        {problem?.problem_statement?.slice(0, 500)?.replaceAll("\n", " ")}
                                                        {problem?.problem_statement?.length > 500 && "..."}
                                                    </p>
                                                </div>
                                                <div className="px-8 py-4 flex items-center justify-center">
                                                    {problem.passed ? (
                                                        <IoMdDoneAll size={28} color="green" title="Passed" />
                                                    ) : (
                                                        null
                                                    )}
                                                </div>
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                        )
                    )
                ) : (
                    <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-lg mt-6 shadow-sm">
                        <h2 className="font-bold text-lg mb-2">Your request to join this arena is pending approval</h2>
                        <p className="text-sm text-gray-700">Please wait for the administrator to approve your request. You will be notified once your request has been processed.</p>
                    </div>
                )}
            </div>


            <div>
                <h1 className="text-2xl font-bold mt-6 mb-4">Standings</h1>
                <ArenaStandings arenaId={arena_id} />
            </div>

        </div>
    );
}
