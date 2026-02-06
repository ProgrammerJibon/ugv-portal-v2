"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import getArenaDetails from "../getArenaDetails";
import SplashScreen from "@/Components/SplashScreen";
import { toast } from "react-toastify";
import insertProblem from "./insertProblemsSet";

export default function ProblemForm() {
    const { id } = useParams();
    if (!id) return <div className="text-center p-6">Arena ID is missing in the URL.</div>;

    const [formData, setFormData] = useState({
        problem_title: "",
        problem_statement: "",
        input_type: "",
        output_type: ""
    });

    const [testcases, setTestcases] = useState([
        { input: "", output: "", run_type: "sample" }
    ]);

    const [dataOfArena, setDataOfArena] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setLoading(true);
        (async () => {
            const arenaData = await getArenaDetails(id);
            setDataOfArena(arenaData);
        })().then(() => setLoading(false));
    }, [id]);

    if (loading) return <SplashScreen />;
    if (!dataOfArena) return <div className="p-10 text-red-600">Arena not found</div>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTestcaseChange = (index, field, value) => {
        const updated = [...testcases];
        updated[index][field] = value;
        setTestcases(updated);
    };

    const addTestcase = () => {
        setTestcases([...testcases, { input: "", output: "", run_type: testcases.length % 2 == 0 ? "server" : "p2p" }]);
    };

    const removeTestcase = (index) => {
        if (index === 0) return;
        setTestcases(testcases.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.problem_statement.trim()) newErrors.problem_statement = "Problem statement is required";
        if (!formData.problem_title.trim()) newErrors.problem_title = "Problem Title is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSubmitting(false);
            validationErrors.forEach((el, i) => {
                toast.error(el);
            });
            return;
        }
        setErrors({});

        try {
            const payload = {
                ...formData,
                arena_id: dataOfArena.id,
                testcases
            };
            const res = await insertProblem(payload);
            if (res && res.success) {
                toast.success("Problem added successfully!");
                window.location.href = `/arena/${id}`;
            } else {
                toast.error(res?.error || "Unknown error occurred.");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
            <div>
                <h1 className="font-bold text-xl text-center">{dataOfArena.id}. {dataOfArena.name}</h1>
                <h3 className="text-sm text-center">{dataOfArena?.university?.name} (Batch: {dataOfArena?.batch_no})</h3>
            </div>

            <div>
                <span className="font-semibold">Problem Title</span>
                <input required type="text" name="problem_title" value={formData.problem_title} onChange={handleChange}
                    className="w-full p-3 border text-sm rounded-lg" />
            </div>

            <div>
                <span  className="font-semibold">Problem Statement</span>
                <textarea required name="problem_statement" value={formData.problem_statement} onChange={handleChange}
                    className="w-full min-h-96 p-3 border text-xs rounded-lg" />
            </div>

            <div>
                <span className="font-semibold">Input Type</span>
                <textarea name="input_type" value={formData.input_type} onChange={handleChange}
                    className="w-full min-h-32 p-3 border text-xs rounded-lg" />
            </div>

            <div>
                <span className="font-semibold">Output Type</span>
                <textarea name="output_type" value={formData.output_type} onChange={handleChange}
                    className="w-full min-h-32 p-3 border text-xs rounded-lg" />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold">Sample Testcases</h2>
                {testcases.map((tc, index) => (
                    <div key={index} className="border-t pt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Testcase {index + 1}</span>
                            {index !== 0 && (
                                <button type="button" onClick={() => removeTestcase(index)}
                                    className="text-red-600 font-bold">✕</button>
                            )}
                        </div>

                        <textarea value={tc.input} onChange={(e) => handleTestcaseChange(index, "input", e.target.value)}
                            className="w-full min-h-24 p-3 border text-xs rounded-lg"
                            placeholder="Input Testcase" />

                        <textarea value={tc.output} required onChange={(e) => handleTestcaseChange(index, "output", e.target.value)}
                            className="w-full min-h-24 p-3 border text-xs rounded-lg"
                            placeholder="Output Testcase" />

                        {index > 0 && <select value={tc.run_type}
                            onChange={(e) => handleTestcaseChange(index, "run_type", e.target.value)}
                            className="w-full p-2 border rounded-lg text-sm">
                            <option value="sample">sample</option>
                            <option value="p2p">p2p</option>
                            <option value="server">server</option>
                        </select>}
                    </div>
                ))}
                <button type="button" onClick={addTestcase}
                    className="bg-gray-200 px-4 py-2 rounded-lg font-semibold">
                    + Add Testcase
                </button>
            </div>

            

            <div className="h-[40px]">
                {submitting ? <HashLoader /> :
                    <button type="submit"
                        className="bg-blue-600 hover:bg-blue-900 active:bg-blue-950 cursor-pointer w-full text-white font-semibold py-3 rounded-lg">
                        <span>Publish Problem</span>
                    </button>}
            </div>
        </form>
    );
}
