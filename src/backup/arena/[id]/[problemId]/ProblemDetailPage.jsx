"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SplashScreen from "@/Components/SplashScreen";
import getProblemDetails from "./getProblemDetails";
import { toast } from "react-toastify";
import Editor from "@monaco-editor/react";
import checkIfArenaUser from "@/app/json/serverFunctions";
import CodeCompiler from "@/Components/CodeCompiler";
import checkServerTestcasesAndPushResults from "./checkServerTestcasesAndPushResults";
import Link from "next/link";
import getSubmissionsCount from "./submission/getSubmissionsCount";
import SubmissionCountsNavbar from "./submission/SubmissionCountsNavbar";
import getArenaDetails from "../getArenaDetails";



export default function ProblemDetailPage({ user }) {
    const { id, problemId } = useParams();

    const [loading, setLoading] = useState(true);
    const [problem, setProblem] = useState(null);
    const [sampleTestcases, setSampleTestcases] = useState([]);
    const [p2pTestcases, setP2pTestcases] = useState([]);
    const [localRunPass, setLocalRunPass] = useState(false);
    const [codeIsRunning, setCodeIsRunning] = useState(false);
    const [codeRunResult, setCodeRunResult] = useState(null);
    const [showCodeRunResult, setShowCodeRunResult] = useState(false);
    const [countsOfSubmissionTypes, setCountOfSubmissionTypes] = useState(null);
    const [arenaDetails, setArenaDetails] = useState(null);

    // restore previous code
    const storageKeyCode = `arena_${id}_problem_${problemId}_code`;
    const savedCode = typeof window == 'undefined' || localStorage.getItem(storageKeyCode);
    const [code, setCode] = useState(savedCode?atob(savedCode):"");
    const storageKeyLang = `arena_${id}_problem_${problemId}_lang`;
    const savedLang = typeof window == 'undefined' || localStorage.getItem(storageKeyLang);
    const [solvingLanguage, setSolvingLanguage] = useState(storageKeyLang ? (atob(savedLang) || "java") :"c++");

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const checkIfArenaUserRes = await checkIfArenaUser(id, user.id);
                if (!checkIfArenaUserRes || checkIfArenaUserRes.status != "APPROVED") {
                    toast.error("You are not authorized to view this problem.");
                    setProblem(null);
                    return;
                }
                const res = await getProblemDetails(problemId);


                if (!res || res.error) {
                    setProblem(null);
                    return;
                }


                if (res?.problem?.arena_id) {
                    const arenaDtls = await getArenaDetails(res?.problem?.arena_id);
                    setArenaDetails(arenaDtls);
                }


                setProblem(res.problem);

                const samples = [];
                const p2p = [];
                const initialResults = [];




                res.testcases.forEach((tc, index) => {
                    if (tc.testcase_type == 0) samples.push(tc);
                    if (tc.testcase_type == 1) p2p.push(tc);

                    initialResults.push({
                        i: index,
                        id: tc.id,
                        running: false,
                        type: tc?.testcase_type,
                        showResult: true,
                    });
                });

                setSampleTestcases(samples);
                setP2pTestcases(p2p);
                setCodeRunResult(initialResults);
            } finally {
                setLoading(false);
            }
        })();



    }, [problemId]);

    useEffect(() => {
        (async () => {
            if (problem?.arena_id && problem?.id) {
                const counts = await getSubmissionsCount(problem?.arena_id, problem?.id);
                setCountOfSubmissionTypes(counts);
            }

        })();
    }, [problem])

    useEffect(() => {
        setLocalRunPass(false);
        const storageKey = `arena_${id}_problem_${problemId}_code`;
        localStorage.setItem(storageKey, btoa(code));
    }, [code]);

    useEffect(() => {
        setLocalRunPass(false);
        const storageKey = `arena_${id}_problem_${problemId}_lang`;
        localStorage.setItem(storageKey, btoa(solvingLanguage));
    }, [solvingLanguage])


    const handleRun = async (withSubmitRequest = false) => {
        setCodeIsRunning(true);

        try {
            let flagAllPassed = true;
            if ((withSubmitRequest && !localRunPass) || !withSubmitRequest) {
                const problemTestCases = withSubmitRequest ? [...sampleTestcases, ...p2pTestcases] : sampleTestcases;
                setCodeRunResult(prev => prev.map(r => ({ ...r, running: true, passed: false, showResult: false })));
                setShowCodeRunResult(true);

                await Promise.all(
                    problemTestCases.map(async (tc) => {
                        setCodeRunResult(prev => {
                            const updated = [...prev];
                            const idx = updated.findIndex(item => item?.id === tc?.id);
                            if (idx !== -1) {
                                updated[idx] = {
                                    ...updated[idx],
                                    running: true,
                                    showResult: true
                                };
                            }
                            prev.map(r => {
                                if (withSubmitRequest && r?.type == "2") {
                                    const idx2 = updated.findIndex(item => item?.id === r?.id);
                                    if (idx2 !== -1) {

                                        updated[idx2] = {
                                            ...updated[idx2],
                                            running: true,
                                            showResult: true
                                        };
                                    }
                                }
                            });

                            return updated;
                        });
                        const runRes = await CodeCompiler({
                            code,
                            input: tc.testcase_input || "",
                            language: solvingLanguage,
                        });

                        const passed = !runRes?.error && runRes?.output?.trim() === tc?.testcase_output?.trim();
                        if (!passed) flagAllPassed = false;

                        setCodeRunResult(prev => {
                            const updated = [...prev];
                            const idx = updated.findIndex(item => item?.id === tc?.id);
                            if (idx !== -1) {
                                updated[idx] = {
                                    ...runRes,
                                    i: idx,
                                    id: tc.id,
                                    running: false,
                                    passed,
                                    type: tc?.testcase_type,
                                    showResult: true
                                };
                            }
                            return updated;
                        });
                    })
                );

            } else if (localRunPass && withSubmitRequest) {
                setCodeRunResult(prev => prev.map(r => ({ ...r, running: true, passed: true, showResult: true })));
            }




            if (withSubmitRequest) {
                if (!flagAllPassed) {
                    toast.error("You must pass all testcases before submitting.");
                    return;
                }
                const resServer = await checkServerTestcasesAndPushResults({
                    arena_id: problem?.arena_id,
                    problem_id: problemId,
                    code: code,
                    codeRunResultClient: codeRunResult,
                    language_name: solvingLanguage
                });
                if (resServer.error) {
                    toast.error("An error occurred while submitting: " + resServer.error);
                    return;
                } else {
                    toast.success("Code submitted successfully!");
                    setTimeout(()=>{
                        window.location.href = "/arena/" + problem?.arena_id + "/"+problemId+"/submission"
                    }, 1500);
                    console.log(resServer.codeRunResult);

                    setCodeRunResult(resServer.codeRunResult);
                }

            }
            setLocalRunPass(flagAllPassed);



        } catch (err) {
            toast.error("An error occurred while running the code: " + err.message);
        } finally {
            setCodeIsRunning(false);
        }
    };

    // console.log(codeRunResult);





    if (loading) return <SplashScreen />;
    if (!problem) return <div className="p-10 text-center text-red-600">Problem not found</div>;
    if (problem?.arena_id != id) return <div className="p-10 text-center text-red-600">Problem does not belong to this arena</div>;

    return (
        <div className="w-10/12 max-w-5xl mx-auto pt-16 pb-32 space-y-10 ">
            <div className="space-y-4">
                <SubmissionCountsNavbar
                    countsOfSubmissionTypes={countsOfSubmissionTypes}
                    arenaId={problem?.arena_id}
                    problemId={problem?.id}
                />

                <h1 className="text-3xl font-bold"><Link href={"/arena/" + problem.arena_id}>[{problem.arena_id}]</Link>{"\t"}{problem.id}. {problem.ProblemName}</h1>

                <div className="prose max-w-none whitespace-pre-wrap text-sm">
                    {problem.problem_statement}
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Input</h3>
                    <div className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">
                        {problem.input_type}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Output</h3>
                    <div className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">
                        {problem.output_type}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Sample Testcases</h2>

                {sampleTestcases.map((tc, index) => (
                    <div key={tc.id} className="border rounded-lg overflow-hidden">
                        <div className=" px-4 pt-4 pb-2 font-semibold">
                            Sample #{index + 1}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 px-4 pb-2">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-sm">Input</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.target.innerText = "Copied!";
                                            e.target.disabled = true;
                                            setTimeout(() => {
                                                e.target.innerText = "Copy";
                                                e.target.disabled = false;
                                            }, 1000);
                                            return navigator.clipboard.writeText(tc.testcase_input)
                                        }}
                                        className="text-xs text-blue-600 cursor-pointer hover:text-blue-400"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap">
                                    {tc.testcase_input}
                                </pre>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-sm">Output</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.target.innerText = "Copied!";
                                            e.target.disabled = true;
                                            setTimeout(() => {
                                                e.target.innerText = "Copy";
                                                e.target.disabled = false;
                                            }, 1000);
                                            return navigator.clipboard.writeText(tc.testcase_output)
                                        }}
                                        className="text-xs text-blue-600 cursor-pointer hover:text-blue-400"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap">
                                    {tc.testcase_output}
                                </pre>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {arenaDetails && arenaDetails?.status == "ACTIVE" && <>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Submit Your Code</h2>


                    <Editor
                        height="400px"
                        defaultLanguage="cpp"
                        theme="vs-ligth"
                        value={code}
                        onChange={(v) => !codeIsRunning && setCode(v || "")}
                        className="border border-gray-300 rounded-lg overflow-hidden "
                        options={{
                            fontSize: 14,
                            padding: { top: 32 },
                            minimap: { enabled: false },
                            automaticLayout: true,
                            tabSize: 4,
                            insertSpaces: true,
                            readOnly: codeIsRunning,
                        }}
                    />

                    {codeRunResult && showCodeRunResult && codeRunResult.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Run Results</h3>
                            {codeRunResult.map((res, index) => res.showResult && (
                                <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                                    <div className=" px-4 pt-4 pb-2 font-semibold flex space-x-2">
                                        <div>Sample #{res.i + 1} </div>
                                        {!res.running && "passed" in res && <div className={`font-semibold mb-2 ${res.passed ? "text-green-600" : "text-red-600"}`}>
                                            {res.passed ? "Passed" : "Failed"}
                                        </div>}
                                    </div>

                                    <div className="px-4 pb-4 space-y-2">
                                        {res.running ? (
                                            <div>Running...</div>
                                        ) : res.type == "0" && (res.error ? (
                                            <>
                                                {sampleTestcases[res.i].testcase_input && <>
                                                    <div className="font-semibold mb-1">Input:</div>
                                                    <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap">
                                                        {sampleTestcases[res.i].testcase_input}
                                                    </pre>
                                                </>}
                                                <div className="">
                                                    <div className="font-semibold mb-1 ">Error {res.error}:</div>
                                                    <pre className="bg-gray-100 p-3 text-red-600 rounded text-xs whitespace-pre-wrap">
                                                        {res.errorMsg}
                                                    </pre>
                                                </div>
                                            </>
                                        ) : (
                                            <div>
                                                {sampleTestcases[res.i].testcase_input && <>
                                                    <div className="font-semibold mb-1">Input:</div>
                                                    <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap">
                                                        {sampleTestcases[res.i].testcase_input}
                                                    </pre>
                                                </>}
                                                {res.output && <>
                                                    <div className="font-semibold mb-1">Output:</div>
                                                    <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap">
                                                        {res.output}
                                                    </pre>
                                                </>}
                                                {sampleTestcases[res.i].testcase_output && <>
                                                    <div className="font-semibold mb-1">Expected Output:</div>
                                                    <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap">
                                                        {sampleTestcases[res.i].testcase_output}
                                                    </pre>
                                                </>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div>
                            <select
                                value={solvingLanguage}
                                onChange={(e) => setSolvingLanguage(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="java">Java</option>
                                <option value="c">C</option>
                                <option value="c++">C++</option>
                                <option value="php">PHP</option>
                            </select>
                        </div>
                        <button
                            disabled={code.trim().length === 0 || codeIsRunning}
                            onClick={e => handleRun(false)}
                            type="button"
                            className="px-6 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 bg-gray-600 text-white font-semibold hover:bg-gray-700"
                        >
                            Run
                        </button>
                        {code.trim().length > 0 && localRunPass && !codeIsRunning && (
                            <button
                                disabled={code.trim().length === 0 || !localRunPass || codeIsRunning}
                                title={!localRunPass ? "You need to pass run before submitting" : ""}
                                type="button"
                                onClick={() => handleRun(true)}
                                className="px-6 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500 bg-blue-600 text-white font-semibold hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        )}

                    </div>
                </div>
            </>}
        </div>
    );
}
