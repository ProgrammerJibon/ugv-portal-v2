"use server";

import Link from "next/link";
import { connectDatabase } from "../json/connectDatabase";

export default async ({ }) => {
    const connect = await connectDatabase();
    // SELECT * FROM `arena_list`
    // id    name    created_by    created_on    country_code    university_id    batch_no    pricing    payment_method    payment_acount_number    status    comment
    const [list] = await connect.execute("SELECT arena_list.id AS arena_id, arena_list.name AS arena_name, arena_list.*, university_list.id AS university_id, university_list.name AS university_name FROM arena_list INNER JOIN university_list ON university_list.id = arena_list.university_id WHERE arena_list.status = 'active' OR arena_list.status = 'closed' ORDER BY arena_list.created_on DESC");
    // // await // connect.end();
    if (!list || list.length === 0) {
        return <>No arena found</>;
    }


    return (
        <div className="flex flex-col gap-4 w-full py-4">
            {list.map((arena) => (
                <Link
                    href={"/arena/" + arena.id}
                    key={arena.id}
                    className="group relative w-full flex flex-col md:flex-row md:items-center justify-between p-6 
                   bg-white/10 backdrop-blur-md border border-gray-300 rounded-2xl 
                   shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
                   hover:bg-white/20 hover:border-gray-400 transition-all duration-300 ease-in-out"
                >
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 ">
                                {arena.name}
                            </h2>
                            {arena.status.toLowerCase() === "closed" && (
                                <span className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100/50 backdrop-blur-sm rounded-full border border-red-200">
                                    Closed
                                </span>
                            )}
                        </div>
                        <h3 className="text-gray-500  font-medium">
                            {arena.university_name}
                        </h3>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 bg-black/5  rounded-xl border border-white/10">
                            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Batch</span>
                            <span className="text-lg font-semibold text-gray-700 ">{arena.batch_no}</span>
                        </div>

                        <div className="text-sm font-semibold text-blue-500 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                            View Details <span>→</span>
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                </Link>
            ))}
        </div>
    );
}