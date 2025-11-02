import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export async function GET(): Promise<Response> {
  const scriptPath = path.join(process.cwd(), "scripts", "retrain_export.py");
  const outputFile = path.join(
    process.cwd(),
    "scripts",
    "adviser_prediction_model.pkl"
  );

  return new Promise<Response>((resolve) => {
    exec(
      `python3 "${scriptPath}" "${outputFile}"`,
      { maxBuffer: 1024 * 1024 * 50 }, // 50MB buffer
      (error, stderr) => {
        if (error) {
          console.error("Exec Error:", error);
          resolve(
            NextResponse.json(
              { success: false, message: error.message },
              { status: 500 }
            )
          );
          return;
        }

        if (stderr) console.error("Python stderr:", stderr);

        if (!fs.existsSync(outputFile)) {
          resolve(
            NextResponse.json(
              { success: false, message: "Model file not found." },
              { status: 500 }
            )
          );
          return;
        }

        const fileBuffer = fs.readFileSync(outputFile);

        resolve(
          new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/octet-stream",
              "Content-Disposition":
                "attachment; filename=adviser_prediction_model.pkl",
            },
          })
        );
      }
    );
  });
}
