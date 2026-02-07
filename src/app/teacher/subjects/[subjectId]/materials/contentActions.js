"use server";

import { connectDatabase } from "@/app/json/connectDatabase";
import path from "path";
import { writeFile, unlink, mkdir } from "fs/promises"; // Added 'mkdir'

// 1. Fetch Materials for a Specific Subject
export async function getMaterialsAction(subjectId) {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute(
            "SELECT * FROM course_materials WHERE subject_id = ? ORDER BY id DESC",
            [subjectId]
        );
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to load materials." };
    }
}

export async function uploadContentAction(formData) {
    const db = await connectDatabase();

    const subjectId = formData.get("subjectId");
    const teacherId = formData.get("teacherId");
    const title = formData.get("title");
    const description = formData.get("description");
    const file = formData.get("file");

    if (!file || !title) {
        return { status: "error", message: "Title and File are required." };
    }

    try {
        // --- A. File Processing ---
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;

        // Define upload path
        const uploadDir = path.join(process.cwd(), "public/uploads");

        // [FIX] Create the directory if it doesn't exist
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        // Save file to disk
        await writeFile(filePath, buffer);

        // --- B. Metadata Prep ---
        const relativePath = `/uploads/${filename}`;
        const fileType = file.name.split('.').pop().toLowerCase();

        // Convert bytes to MB/KB string
        const sizeMb = file.size / (1024 * 1024);
        const fileSizeStr = sizeMb < 1
            ? `${(file.size / 1024).toFixed(0)} KB`
            : `${sizeMb.toFixed(1)} MB`;

        const dateStr = new Date().toISOString().split('T')[0];

        // --- C. Database Insert ---
        const query = `
            INSERT INTO course_materials 
            (subject_id, teacher_id, title, description, file_path, file_type, file_size, upload_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.execute(query, [
            subjectId, teacherId, title, description,
            relativePath, fileType, fileSizeStr, dateStr
        ]);

        return { status: "success", message: "Material uploaded successfully!" };

    } catch (error) {
        console.error("Upload Error:", error);
        return { status: "error", message: "Failed to upload file." };
    }
}

// 3. Delete Content
export async function deleteContentAction(materialId, filePath) {
    const db = await connectDatabase();
    try {
        // 1. Delete from DB
        await db.execute("DELETE FROM course_materials WHERE id = ?", [materialId]);

        // 2. Delete from Disk (Optional: keeps folder clean)
        if (filePath) {
            const absolutePath = path.join(process.cwd(), "public", filePath);
            try {
                await unlink(absolutePath);
            } catch (e) {
                console.log("File cleanup failed (file might not exist):", e);
            }
        }

        return { status: "success", message: "Deleted successfully." };
    } catch (error) {
        return { status: "error", message: "Delete failed." };
    }
}