import * as XLSX from "xlsx";
import { supabase } from "@/utils/supabase/seedClient";

// 1️⃣ Match your new Excel headers
interface RawThesisRow {
  "no."?: number;
  Year?: string | number;
  Adviser?: string;
  Panelists?: string;
  Title?: string;
  Researchers?: string;
  Abstract?: string;
  Keywords?: string;
  Category?: string;
}

// 2️⃣ Type for Supabase insertion
interface ThesisInsert {
  title: string;
  abstract?: string | null;
  keywords?: string[] | null;
  proponents?: string[] | null;
  adviser_id?: string | null;
  adviser_name?: string | null;
  panel_member1?: string | null;
  panel_member2?: string | null;
  panel_member3?: string | null;
  defense_year?: number | null;
  category?: string[] | null;
}

// 3️⃣ Fetch adviser & faculty profiles
async function getUserProfileMap(): Promise<{
  byFullName: Map<string, { id: string; full_name: string }>;
  byLastName: Map<string, { id: string; full_name: string }>;
}> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id, full_name");

  if (error) {
    console.error("❌ Error fetching user profiles:", error.message);
    return { byFullName: new Map(), byLastName: new Map() };
  }

  const byFullName = new Map<string, { id: string; full_name: string }>();
  const byLastName = new Map<string, { id: string; full_name: string }>();

  data.forEach((user) => {
    const name = user.full_name.trim().toLowerCase();
    byFullName.set(name, { id: user.user_id, full_name: user.full_name });

    const lastName = name.split(" ").slice(-1)[0];
    if (lastName)
      byLastName.set(lastName, { id: user.user_id, full_name: user.full_name });
  });

  console.log(`👥 Loaded ${data.length} user profiles for name matching`);
  return { byFullName, byLastName };
}

// 4️⃣ Helper: Find a user by name or surname
function findUserByName(
  name: string | null,
  byFullName: Map<string, { id: string; full_name: string }>,
  byLastName: Map<string, { id: string; full_name: string }>
) {
  if (!name) return { id: null, full_name: name };

  // 🧩 Normalize name first
  const lower = name.toLowerCase().trim();

  // 🧩 Manual exceptions or abbreviations
  const exceptions: Record<string, string> = {
    "esclamado, m.": "maricel a. esclamado",
    esclamado: "maricel a. esclamado",
    // you can add more here if needed later
    // e.g. "al-monte v.": "al-monte vince m. calo",
  };

  const normalized = exceptions[lower] || lower;

  // 🧩 Try exact full name match
  if (byFullName.has(normalized)) return byFullName.get(normalized)!;

  // 🧩 Try surname match
  const last = normalized.split(" ").slice(-1)[0];
  if (byLastName.has(last)) return byLastName.get(last)!;

  // 🧩 No match found — return as-is
  return { id: null, full_name: name };
}

// 5️⃣ Main seeding logic
async function seedNewTheses(): Promise<void> {
  try {
    const { byFullName, byLastName } = await getUserProfileMap();

    const workbook = XLSX.readFile("data/new_theses.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: RawThesisRow[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`📚 Found ${rows.length} theses rows in Excel`);

    const mappedRows: ThesisInsert[] = rows.map((row) => {
      // Adviser lookup
      const adviserRaw = row.Adviser?.trim() || null;
      const adviserMatch = findUserByName(adviserRaw, byFullName, byLastName);

      // Parse panelists into separate columns
      const panelList = row.Panelists
        ? row.Panelists.split(",").map((p) => p.trim())
        : [];

      const panel_member1 = panelList[0] || null;
      const panel_member2 = panelList[1] || null;
      const panel_member3 = panelList[2] || null;

      // Optional: match to full names in user_profiles
      const panelMember1Match = panel_member1
        ? findUserByName(panel_member1, byFullName, byLastName).full_name
        : null;
      const panelMember2Match = panel_member2
        ? findUserByName(panel_member2, byFullName, byLastName).full_name
        : null;
      const panelMember3Match = panel_member3
        ? findUserByName(panel_member3, byFullName, byLastName).full_name
        : null;

      const keywords =
        row.Keywords?.split(",")
          .map((k) => k.trim())
          .filter(Boolean) || [];

      const proponents =
        row.Researchers?.split(",")
          .map((r) => r.trim())
          .filter(Boolean) || [];

      return {
        title: row.Title?.trim() || "",
        abstract: row.Abstract?.trim() || null,
        keywords: keywords.length ? keywords : null,
        proponents: proponents.length ? proponents : null,
        adviser_id: adviserMatch.id,
        adviser_name: adviserMatch.full_name,
        panel_member1: panelMember1Match,
        panel_member2: panelMember2Match,
        panel_member3: panelMember3Match,
        defense_year: row.Year ? parseInt(String(row.Year)) : null,
        category:
          row.Category?.split(",")
            .map((c) => c.trim())
            .filter(Boolean) || null,
      };
    });

    const validRows = mappedRows.filter(
      (r) => r.title && r.title.trim() !== ""
    );
    console.log(`🚀 Inserting ${validRows.length} theses...`);

    const { error } = await supabase.from("theses").insert(validRows);

    if (error) console.error("❌ Error inserting theses:", error.message);
    else console.log(`✅ Successfully inserted ${validRows.length} theses`);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    process.exit(0);
  }
}

seedNewTheses();
