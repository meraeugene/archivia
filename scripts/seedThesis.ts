import * as XLSX from "xlsx";
import { supabase } from "@/utils/supabase/seedClient";

// 1️ Excel Row type (matching your Excel headers)
interface RawThesisRow {
  TITLE?: string;
  ABSTRACT?: string;
  KEYWORDS?: string;
  PROPONENTS?: string;
  ADVISER?: string;
  PANEL1?: string;
  PANEL2?: string;
  PANEL3?: string;
  "DEFENSE YEAR"?: string | number;
}

// 2️ Type for inserting into Supabase
interface ThesisInsert {
  title: string;
  abstract?: string | null;
  keywords: string[];
  proponents: string[];
  adviser_id?: string | null;
  adviser_name?: string | null;
  panel_chair_name?: string | null;
  panel_members: string[];
  defense_year?: number | null;
}

// 3️ Fetch adviser profiles once
async function getAdviserMap(): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id, full_name");

  if (error) {
    console.error("❌ Error fetching user profiles:", error.message);
    return new Map();
  }

  const map = new Map<string, string>();
  data.forEach((user) => {
    // normalize names (case-insensitive comparison)
    map.set(user.full_name.trim().toLowerCase(), user.user_id);
  });

  console.log(`👥 Loaded ${map.size} user profiles for adviser matching`);
  return map;
}

// 4️ Main seed function
async function seedTheses(): Promise<void> {
  try {
    const adviserMap = await getAdviserMap();

    const workbook = XLSX.readFile("data/theses.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: RawThesisRow[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`📚 Found ${rows.length} theses rows in Excel`);

    const mappedRows: ThesisInsert[] = rows.map((row) => {
      const adviserName = row.ADVISER?.trim() || null;
      const adviserId = adviserName
        ? adviserMap.get(adviserName.toLowerCase()) || null
        : null;

      return {
        title: row.TITLE?.trim() || "",
        abstract: row.ABSTRACT?.trim() || null,
        keywords: row.KEYWORDS
          ? row.KEYWORDS.split(",").map((s) => s.trim())
          : [],
        proponents: row.PROPONENTS
          ? row.PROPONENTS.split(",").map((s) => s.trim())
          : [],
        adviser_id: adviserId,
        adviser_name: adviserName,
        panel_chair_name: row.PANEL1?.trim() || null,
        panel_members: [row.PANEL2, row.PANEL3]
          .filter((m): m is string => !!m && m.trim() !== "")
          .map((m) => m.trim()),
        defense_year: row["DEFENSE YEAR"]
          ? parseInt(String(row["DEFENSE YEAR"]))
          : null,
      };
    });

    const filteredRows = mappedRows.filter(
      (r) => r.title && r.title.trim() !== ""
    );

    console.log(`🚀 Inserting ${filteredRows.length} theses...`);

    const { error } = await supabase.from("theses").insert(filteredRows);

    if (error) {
      console.error("❌ Error inserting theses:", error.message);
    } else {
      console.log(`✅ Successfully inserted ${filteredRows.length} theses`);
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    process.exit(0);
  }
}

seedTheses();
