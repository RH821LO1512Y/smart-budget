import { useState, useEffect, useCallback, useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine,
  LineChart, Line, Area, AreaChart
} from "recharts";
import { Upload, DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar, Tag, CheckCircle, Circle, Plus, Trash2, X, ChevronLeft, ChevronRight, ArrowRight, AlertCircle, PiggyBank, Target, Edit2 } from "lucide-react";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0D0C1D",
  card: "#16152B",
  cardHover: "#1E1C35",
  border: "#2A2850",
  coral: "#A78BFA",
  teal: "#4ECDC4",
  yellow: "#FFE66D",
  purple: "#A78BFA",
  green: "#6BCB77",
  blue: "#6BCB77",
  text: "#F0EEFF",
  muted: "#8B86B0",
  white: "#FFFFFF",
};

const CATEGORY_COLORS = [T.coral, T.teal, T.yellow, T.purple, T.green, T.blue, "#FB923C", "#F472B6", "#34D399", "#FCD34D"];

const DEFAULT_CATEGORIES = [
  // ── Income & Savings ──────────────────────────────────────────
  { id: "income",       name: "Income",          color: "#6BCB77", budget: 0,    type: "income"   },
  { id: "savings",      name: "Savings",          color: "#FCD34D", budget: 500,  type: "savings"  },
  // ── Housing ───────────────────────────────────────────────────
  { id: "housing",      name: "Rent",             color: "#A78BFA", budget: 1500, type: "expense"  },
  // ── Food ──────────────────────────────────────────────────────
  { id: "food",         name: "Food & Dining",    color: "#4ECDC4", budget: 600,  type: "expense"  },
  { id: "grocery",      name: "Grocery",          color: "#34D399", budget: 400,  type: "expense"  },
  // ── Transport ─────────────────────────────────────────────────
  { id: "transport",    name: "Transportation",   color: "#FFE66D", budget: 300,  type: "expense"  },
  // ── Utilities ─────────────────────────────────────────────────
  { id: "utilities",    name: "Utilities",        color: "#60A5FA", budget: 250,  type: "expense"  },
  // ── Health ────────────────────────────────────────────────────
  { id: "health_ins",   name: "Health Insurance", color: "#6BCB77", budget: 300,  type: "expense"  },
  { id: "healthcare",   name: "Healthcare",       color: "#F87171", budget: 200,  type: "expense"  },
  // ── Debt & Credit ─────────────────────────────────────────────
  { id: "credit_cards", name: "Credit Cards",     color: "#3B82F6", budget: 400,  type: "expense"  },
  { id: "loans_debt",   name: "Loans & Debt",     color: "#F59E0B", budget: 500,  type: "expense"  },
  // ── Lifestyle ─────────────────────────────────────────────────
  { id: "personal_care",name: "Personal Care",    color: "#F472B6", budget: 150,  type: "expense"  },
  { id: "entertainment",name: "Entertainment",    color: "#A78BFA", budget: 150,  type: "expense"  },
  { id: "baby",         name: "Baby",             color: "#FDE68A", budget: 150,  type: "expense"  },
  { id: "pets",         name: "Pets",             color: "#A3E635", budget: 100,  type: "expense"  },
  { id: "contribution", name: "Contribution",     color: "#C4B5FD", budget: 100,  type: "expense"  },
  { id: "notary",       name: "Notary",           color: "#94A3B8", budget: 0,    type: "expense"  },
  // ── Travel & Misc ─────────────────────────────────────────────
  { id: "travel",       name: "Travel",           color: "#67E8F9", budget: 200,  type: "expense"  },
  { id: "shopping",     name: "Shopping / Misc",  color: "#FB923C", budget: 200,  type: "expense"  },
  { id: "work",         name: "Work",             color: "#94A3B8", budget: 0,    type: "expense"  },
  { id: "other",        name: "Other",            color: "#8B86B0", budget: 100,  type: "expense"  },
];

// ── Default keyword → category mappings (Rachel's custom list) ────────────────
const DEFAULT_KEYWORDS = [
  // Income
  { id: "kw_payroll",    keyword: "payroll",           categoryId: "income"        },
  { id: "kw_salary",     keyword: "salary",            categoryId: "income"        },
  { id: "kw_ddep",       keyword: "direct deposit",    categoryId: "income"        },
  { id: "kw_zelle",      keyword: "zelle",             categoryId: "income"        },
  // Savings
  { id: "kw_acorns",     keyword: "acorns",            categoryId: "savings"       },
  { id: "kw_marcus1",    keyword: "marcus",            categoryId: "savings"       },
  { id: "kw_goldman",    keyword: "goldman",           categoryId: "savings"       },
  // Rent
  { id: "kw_rent",       keyword: "apts lewis",        categoryId: "housing"       },
  { id: "kw_rent2",      keyword: "rent",              categoryId: "housing"       },
  { id: "kw_mortgage",   keyword: "mortgage",          categoryId: "housing"       },
  // Food
  { id: "kw_chickfila",  keyword: "chick-fil-a",       categoryId: "food"          },
  { id: "kw_dq",         keyword: "dairy queen",       categoryId: "food"          },
  { id: "kw_doordash",   keyword: "doordash",          categoryId: "food"          },
  { id: "kw_mcdonalds",  keyword: "mcdonald",          categoryId: "food"          },
  { id: "kw_shipley",    keyword: "shipley",           categoryId: "food"          },
  { id: "kw_starbucks",  keyword: "starbucks",         categoryId: "food"          },
  { id: "kw_wingstop",   keyword: "wingstop",          categoryId: "food"          },
  { id: "kw_restaurant", keyword: "restaurant",        categoryId: "food"          },
  { id: "kw_ubereats",   keyword: "uber eats",         categoryId: "food"          },
  { id: "kw_grubhub",    keyword: "grubhub",           categoryId: "food"          },
  // Grocery
  { id: "kw_heb",        keyword: "h-e-b",             categoryId: "grocery"       },
  { id: "kw_kroger",     keyword: "kroger",            categoryId: "grocery"       },
  { id: "kw_walmart",    keyword: "wal-mart",          categoryId: "grocery"       },
  { id: "kw_walmart2",   keyword: "walmart",           categoryId: "grocery"       },
  { id: "kw_aldi",       keyword: "aldi",              categoryId: "grocery"       },
  // Transportation (gas + transit combined)
  { id: "kw_chevron",    keyword: "chevron",           categoryId: "transport"     },
  { id: "kw_fuel",       keyword: "fuel",              categoryId: "transport"     },
  { id: "kw_shell",      keyword: "shell",             categoryId: "transport"     },
  { id: "kw_exxon",      keyword: "exxon",             categoryId: "transport"     },
  { id: "kw_hctra",      keyword: "hctra",             categoryId: "transport"     },
  { id: "kw_parking",    keyword: "parking",           categoryId: "transport"     },
  { id: "kw_uber",       keyword: "uber",              categoryId: "transport"     },
  { id: "kw_lyft",       keyword: "lyft",              categoryId: "transport"     },
  // Utilities (phone + wifi + electric combined)
  { id: "kw_cpenergy",   keyword: "cpenergy",          categoryId: "utilities"     },
  { id: "kw_reliant",    keyword: "reliant",           categoryId: "utilities"     },
  { id: "kw_comcast",    keyword: "comcast",           categoryId: "utilities"     },
  { id: "kw_mobile",     keyword: "mobile",            categoryId: "utilities"     },
  { id: "kw_tmobile",    keyword: "t-mobile",          categoryId: "utilities"     },
  { id: "kw_att",        keyword: "at&t",              categoryId: "utilities"     },
  { id: "kw_xfinity",    keyword: "xfinity",           categoryId: "utilities"     },
  { id: "kw_spectrum",   keyword: "spectrum",          categoryId: "utilities"     },
  { id: "kw_verizon",    keyword: "verizon",           categoryId: "utilities"     },
  // Health Insurance (separate)
  { id: "kw_aetna",      keyword: "aetna",             categoryId: "health_ins"    },
  { id: "kw_ambetter",   keyword: "ambetter",          categoryId: "health_ins"    },
  { id: "kw_guardian",   keyword: "guardian",          categoryId: "health_ins"    },
  // Healthcare (dental + medical)
  { id: "kw_dental",     keyword: "dental",            categoryId: "healthcare"    },
  { id: "kw_napaa",      keyword: "napaanesth",        categoryId: "healthcare"    },
  { id: "kw_peds_uro",   keyword: "pediatric urology", categoryId: "healthcare"    },
  { id: "kw_serene",     keyword: "serene",            categoryId: "healthcare"    },
  { id: "kw_kelsey",     keyword: "kelsey",            categoryId: "healthcare"    },
  { id: "kw_memorial",   keyword: "memorial herma",    categoryId: "healthcare"    },
  // Credit Cards
  { id: "kw_apple",      keyword: "applecard",         categoryId: "credit_cards"  },
  { id: "kw_citi",       keyword: "citi",              categoryId: "credit_cards"  },
  { id: "kw_sync",       keyword: "synchrony bank",    categoryId: "credit_cards"  },
  { id: "kw_wf_cred",    keyword: "wf credit",         categoryId: "credit_cards"  },
  // Loans & Debt
  { id: "kw_wf_pay",     keyword: "wf payment",        categoryId: "loans_debt"    },
  { id: "kw_amoco",      keyword: "amoco",             categoryId: "loans_debt"    },
  { id: "kw_jgw",        keyword: "jgw",               categoryId: "loans_debt"    },
  { id: "kw_oportun",    keyword: "oportun",           categoryId: "loans_debt"    },
  // Personal Care
  { id: "kw_fitness",    keyword: "fitness",           categoryId: "personal_care" },
  { id: "kw_sally",      keyword: "sally",             categoryId: "personal_care" },
  { id: "kw_salon",      keyword: "salon",             categoryId: "personal_care" },
  // Entertainment
  { id: "kw_netflix",    keyword: "netflix",           categoryId: "entertainment" },
  { id: "kw_spotify",    keyword: "spotify",           categoryId: "entertainment" },
  { id: "kw_hulu",       keyword: "hulu",              categoryId: "entertainment" },
  { id: "kw_disney",     keyword: "disney+",           categoryId: "entertainment" },
  { id: "kw_sub",        keyword: "subscription",      categoryId: "entertainment" },
  { id: "kw_movie",      keyword: "movie",             categoryId: "entertainment" },
  // Baby
  { id: "kw_carters",    keyword: "carters",           categoryId: "baby"          },
  // Pets
  { id: "kw_rainwalk",   keyword: "rainwalk",          categoryId: "pets"          },
  { id: "kw_petco",      keyword: "petco",             categoryId: "pets"          },
  { id: "kw_petsmart",   keyword: "petsmart",          categoryId: "pets"          },
  // Contribution
  { id: "kw_tithe",      keyword: "tithe.ly",          categoryId: "contribution"  },
  // Notary
  { id: "kw_notary",     keyword: "notary",            categoryId: "notary"        },
  // Shopping / Misc
  { id: "kw_amazon",     keyword: "amazon",            categoryId: "shopping"      },
  { id: "kw_homedepot",  keyword: "home depot",        categoryId: "shopping"      },
  { id: "kw_target",     keyword: "target",            categoryId: "shopping"      },
  // Travel
  { id: "kw_iah",        keyword: "iah",               categoryId: "travel"        },
  { id: "kw_airport",    keyword: "airport",           categoryId: "travel"        },
  { id: "kw_hotel",      keyword: "hotel",             categoryId: "travel"        },
  // Work
  { id: "kw_mailmeteor", keyword: "mailmeteor",        categoryId: "work"          },
];

// ── Bank CSV presets ─────────────────────────────────────────────────────────
const BANK_PRESETS = {
  bofa: {
    name: "Bank of America",
    logo: "🏦",
    // Header names (lowercase matched)
    date: "posted date",
    desc: "payee",
    amount: "amount",
    debit: null,
    credit: null,
    hasHeaders: true,
  },
  chase: {
    name: "Chase",
    logo: "🏛️",
    date: "posting date",
    desc: "description",
    amount: "amount",
    debit: null,
    credit: null,
    hasHeaders: true,
  },
  wellsfargo: {
    name: "Wells Fargo",
    logo: "🐎",
    // No headers — positional (0-indexed)
    date: 0,       // Col A
    amount: 1,     // Col B
    desc: 4,       // Col E
    debit: null,
    credit: null,
    hasHeaders: false,
  },
};


// ── Category ID migration map (old → new consolidated IDs) ───────────────────
const CAT_MIGRATION = {
  "marcus":        "savings",
  "gasoline":      "transport",
  "phone":         "utilities",
  "wifi":          "utilities",
  "electricity":   "utilities",
  "dental":        "healthcare",
  "medical":       "healthcare",
  "apple_card":    "credit_cards",
  "citi_card":     "credit_cards",
  "care_credit":   "credit_cards",
  "wells_fargo":   "credit_cards",
  "car_payment":   "loans_debt",
  "amoco_loan":    "loans_debt",
  "jgw":           "loans_debt",
  "fitness":       "personal_care",
  "self_care":     "personal_care",
  "subscriptions": "entertainment",
  "dogs":          "pets",
};
const migrateCategories = (txns) =>
  txns.map(t => ({ ...t, categoryId: CAT_MIGRATION[t.categoryId] ?? t.categoryId }));


const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n || 0);
const parseAmount = (v) => {
  if (typeof v === "number") return v;
  const s = String(v).replace(/[$,\s]/g, "");
  return parseFloat(s) || 0;
};
// customKeywords: [{id, keyword, categoryId}]
const guessCategory = (desc = "", cats, customKeywords = []) => {
  const d = desc.toLowerCase().trim();
  // 1. Check user-defined keywords FIRST (most specific)
  for (const kw of customKeywords) {
    if (kw.keyword && d.includes(kw.keyword.toLowerCase().trim())) {
      return kw.categoryId;
    }
  }
  // 2. Check built-in DEFAULT_KEYWORDS
  for (const kw of DEFAULT_KEYWORDS) {
    if (kw.keyword && d.includes(kw.keyword.toLowerCase().trim())) {
      return kw.categoryId;
    }
  }
  // 3. Final fallback
  return cats.find(c => c.id === "other")?.id;
};

// ─── Supabase Config ──────────────────────────────────────────────────────────
// 👇 Paste your Supabase project URL and anon key here (from supabase.com → Project Settings → API)
const SUPABASE_URL = "https://mlsnwxuyvfzqqextcems.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Wof2d5MpMxvckU7gNOyP0g_9YhCvf6T";

// Lightweight Supabase REST helper (no npm package needed)
const sb = {
  headers: {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Prefer": "return=representation",
  },
  url: (table, query = "") => `${SUPABASE_URL}/rest/v1/${table}${query}`,

  async getAll(table) {
    const res = await fetch(sb.url(table, "?order=created_at.asc"), { headers: sb.headers });
    if (!res.ok) return [];
    return res.json();
  },

  async upsert(table, row) {
    const res = await fetch(sb.url(table), {
      method: "POST",
      headers: { ...sb.headers, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row),
    });
    return res.ok;
  },

  async upsertMany(table, rows) {
    if (!rows.length) return;
    const res = await fetch(sb.url(table), {
      method: "POST",
      headers: { ...sb.headers, "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(rows),
    });
    return res.ok;
  },

  async remove(table, id) {
    const res = await fetch(sb.url(table, `?id=eq.${id}`), {
      method: "DELETE",
      headers: sb.headers,
    });
    return res.ok;
  },

  async update(table, id, patch) {
    const res = await fetch(sb.url(table, `?id=eq.${id}`), {
      method: "PATCH",
      headers: sb.headers,
      body: JSON.stringify(patch),
    });
    return res.ok;
  },
};

// Check if Supabase is configured
const isSupabaseReady = () =>
  SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co" &&
  SUPABASE_ANON_KEY !== "YOUR_ANON_KEY_HERE";

// Fallback to localStorage when Supabase is not yet configured
const LOCAL_KEY = "budget_app_local";
const localSave = (data) => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch (e) {} };
const localLoad = () => { try { const d = localStorage.getItem(LOCAL_KEY); return d ? JSON.parse(d) : null; } catch (e) { return null; } };

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; }
  .fade-in { animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
  .upload-zone { border: 2px dashed ${T.border}; border-radius: 16px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.3s; }
  .upload-zone:hover, .upload-zone.dragover { border-color: ${T.teal}; background: rgba(78,205,196,0.05); }
  .tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; }
  .btn:hover { transform: translateY(-1px); }
  .btn-primary { background: ${T.teal}; color: ${T.bg}; }
  .btn-primary:hover { background: #5EDDD4; }
  .btn-danger { background: rgba(255,107,107,0.15); color: ${T.coral}; border: 1px solid rgba(255,107,107,0.3); }
  .btn-danger:hover { background: rgba(255,107,107,0.25); }
  .btn-ghost { background: rgba(255,255,255,0.06); color: ${T.muted}; }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); color: ${T.text}; }
  .card { background: ${T.card}; border: 1px solid ${T.border}; border-radius: 16px; padding: 20px; }
  .input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid ${T.border}; border-radius: 10px; padding: 9px 14px; color: ${T.text}; font-size: 14px; outline: none; transition: border 0.2s; }
  .input:focus { border-color: ${T.teal}; }
  .input option { background: ${T.card}; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .modal { background: ${T.card}; border: 1px solid ${T.border}; border-radius: 20px; padding: 28px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .modal.wide { max-width: 720px; }
  .modal.wide { max-width: 720px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 12px; cursor: pointer; transition: all 0.2s; font-size: 14px; font-weight: 500; color: ${T.muted}; border: none; background: none; width: 100%; }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: ${T.text}; }
  .nav-item.active { background: rgba(78,205,196,0.12); color: ${T.teal}; }
  .progress-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 10px 14px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.muted}; border-bottom: 1px solid ${T.border}; }
  td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid rgba(42,40,80,0.5); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }
  @media (max-width: 768px) {
    .sidebar { left: -260px; transition: left 0.3s; }
    .sidebar.open { left: 0; }
    .main-content { margin-left: 0 !important; }
  }
`;
const StyleTag = () => <style dangerouslySetInnerHTML={{ __html: css }} />;

// ─── Components ───────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="card fade-in" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{label}</span>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={color} />
      </div>
    </div>
    <div style={{ fontSize: 24, fontFamily: "Syne", fontWeight: 700, color: T.text }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: T.muted }}>{sub}</div>}
  </div>
);

const CategoryBadge = ({ category }) => (
  <span className="tag" style={{ background: `${category?.color || T.muted}20`, color: category?.color || T.muted }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: category?.color || T.muted, display: "inline-block" }} />
    {category?.name || "Uncategorized"}
  </span>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function BudgetApp() {
  const [tab, setTab] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [bills, setBills] = useState([
    { id: "b1", name: "Rent", amount: 1500, dueDay: 1, isPaid: false, categoryId: "housing", isRecurring: true },
    { id: "b2", name: "Internet", amount: 79, dueDay: 15, isPaid: false, categoryId: "utilities", isRecurring: true },
    { id: "b3", name: "Phone", amount: 65, dueDay: 20, isPaid: false, categoryId: "utilities", isRecurring: true },
  ]);
  const [schedule, setSchedule] = useState([
    { id: "s1", date: "2026-02-25", type: "transfer", amount: 500, note: "Transfer to savings", from: "Checking", to: "Savings" },
    { id: "s2", date: "2026-03-01", type: "bill", amount: 1500, note: "Rent due", from: "Checking", to: "Landlord" },
  ]);
  const [customKeywords, setCustomKeywords] = useState([]);
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    const fmt = d => d.toISOString().split("T")[0];
    return { start: fmt(start), end: fmt(end) };
  });
  const [setupComplete, setSetupComplete] = useState(() => !!localStorage.getItem("smartbudget_setup_done"));
  const [savingsGoals, setSavingsGoals] = useState([
    { id: "sg_emergency", name: "Emergency Fund", targetAmount: 5000, color: "#4ADE80", emoji: "🛡️", note: "3-6 months of expenses" },
    { id: "sg_vacation",  name: "Vacation",       targetAmount: 2000, color: "#67E8F9", emoji: "✈️", note: "Summer 2026" },
  ]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadDrag, setUploadDrag] = useState(false);
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [chartMode, setChartMode] = useState("bar"); // "bar" | "sankey"
  const [notification, setNotification] = useState(null);
  const [modal, setModal] = useState(null);
  const fileRef = useRef();

  const [dbStatus, setDbStatus] = useState("checking"); // "checking" | "connected" | "local"

  // Load data — Supabase if configured, otherwise localStorage
  useEffect(() => {
    (async () => {
      if (isSupabaseReady()) {
        try {
          const [txns, cats, bls, sched, kwds] = await Promise.all([
            sb.getAll("transactions"),
            sb.getAll("categories"),
            sb.getAll("bills"),
            sb.getAll("schedule"),
            sb.getAll("custom_keywords"),
          ]);
          if (txns.length) setTransactions(migrateCategories(txns));
          if (cats.length) {
            // Merge loaded cats with defaults — add any new default cats not in DB
            const loadedIds = new Set(cats.map(c => c.id));
            const missingDefaults = DEFAULT_CATEGORIES.filter(c => !loadedIds.has(c.id));
            setCategories([...cats, ...missingDefaults]);
          }
          if (bls.length) setBills(bls);
          if (sched.length) setSchedule(sched);
          if (kwds.length) setCustomKeywords(kwds);
          const goals = await sb.getAll("savings_goals");
          if (goals.length) setSavingsGoals(goals);
          setDbStatus("connected");
        } catch (e) {
          console.warn("Supabase load failed, falling back to local", e);
          const saved = localLoad();
          if (saved) {
            if (saved.transactions) setTransactions(migrateCategories(saved.transactions));
            if (saved.categories) setCategories(saved.categories);
            if (saved.bills) setBills(saved.bills);
            if (saved.schedule) setSchedule(saved.schedule);
          }
          setDbStatus("local");
        }
      } else {
        const saved = localLoad();
        if (saved) {
          if (saved.transactions) setTransactions(migrateCategories(saved.transactions));
          if (saved.categories) setCategories(saved.categories);
          if (saved.bills) setBills(saved.bills);
          if (saved.schedule) setSchedule(saved.schedule);
          if (saved.customKeywords) setCustomKeywords(saved.customKeywords);
          if (saved.savingsGoals) setSavingsGoals(saved.savingsGoals);
        }
        setDbStatus("local");
      }
      setLoading(false);
    })();
  }, []);

  // Launch setup wizard on first visit
  useEffect(() => {
    if (!loading && !setupComplete) {
      setModal({ type: "setupWizard" });
    }
  }, [loading]);

  // Auto-save — mirrors every state change to Supabase or localStorage
  useEffect(() => {
    if (loading) return;
    if (dbStatus === "connected") {
      // Supabase: upsert all rows (merge-duplicates handles updates)
      sb.upsertMany("transactions", transactions).catch(() => {});
      sb.upsertMany("categories", categories).catch(() => {});
      sb.upsertMany("bills", bills).catch(() => {});
      sb.upsertMany("schedule", schedule).catch(() => {});
      sb.upsertMany("custom_keywords", customKeywords).catch(() => {});
      sb.upsertMany("savings_goals", savingsGoals).catch(() => {});
    } else {
      localSave({ transactions, categories, bills, schedule, customKeywords, savingsGoals });
    }
  }, [transactions, categories, bills, schedule, customKeywords, savingsGoals, loading, dbStatus]);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── File Parsing ─────────────────────────────────────────────────────────
  const handleFiles = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "pdf") {
      notify("PDF support coming soon! Please export your bank statement as CSV or Excel.", "info");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // ── Parse CSV columns ─────────────────────────────────────────────
        const parseCsvLines = (text) => {
          // Handle quoted commas properly
          const lines = [];
          let cur = "", inQ = false;
          const rows = [];
          for (const ch of text) {
            if (ch === '"') inQ = !inQ;
            else if (ch === "\n" && !inQ) { rows.push(cur); cur = ""; }
            else cur += ch;
          }
          if (cur.trim()) rows.push(cur);
          return rows.map(r => {
            const cols = []; let cell = "", q = false;
            for (const ch of r) {
              if (ch === '"') q = !q;
              else if (ch === "," && !q) { cols.push(cell.trim()); cell = ""; }
              else cell += ch;
            }
            cols.push(cell.trim());
            return cols;
          });
        };

        const detectCols = (headers) => {
          const h = headers.map(x => x.toLowerCase().trim());
          // Date: must contain "date" but NOT "update"
          const dateCol = h.findIndex(x => /\bdate\b/.test(x) && !/update/.test(x));
          // Description: explicitly named merchant/payee/desc/narr/memo but NOT "type"
          // Prioritize exact payee/merchant/description — avoid "reference number", "details" etc.
          let descCol = h.findIndex(x => /^(payee|merchant|description|narration|memo|particulars|beneficiary|transaction description|transaction detail)$/.test(x));
          // Fallback: contains the word but isn't "reference number" or "account details" etc.
          if (descCol === -1) descCol = h.findIndex(x => /\b(payee|merchant|memo|narration)\b/.test(x));
          // Amount: single amount column
          let amtCol = h.findIndex(x => /^(amount|transaction amount|amt|transaction amt|net amount|running balance)$/.test(x));
          // Separate debit/credit columns
          const debitCol = h.findIndex(x => /^(debit|debit amount|withdrawals|withdrawal amount|money out)$/.test(x));
          const creditCol = h.findIndex(x => /^(credit|credit amount|deposits|deposit amount|money in)$/.test(x));
          return { dateCol, descCol, amtCol, debitCol, creditCol, headers };
        };

        let parsedRows = [];
        let colMap = null;
        let rawHeaders = [];

        if (ext === "csv") {
          const allRows = parseCsvLines(e.target.result).filter(r => r.length > 1);
          // Detect headerless CSV (Wells Fargo style): first cell looks like a date, not a label
          const firstCell = (allRows[0]?.[0] || "").trim();
          const looksLikeDate = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(firstCell);
          if (looksLikeDate) {
            // Headerless — inject positional headers and open mapper pre-filled for WF
            rawHeaders = allRows[0].map((_, i) => `Column ${i + 1}`);
            colMap = { dateCol: 0, descCol: 4, amtCol: 1, debitCol: -1, creditCol: -1, headers: rawHeaders };
            setModal({ type: "columnMapper", headers: rawHeaders, dataRows: allRows, colMap, detectedBank: "wellsfargo" });
            return;
          }
          rawHeaders = allRows[0];
          colMap = detectCols(rawHeaders);
          const dataRows = allRows.slice(1);

          // Validate the detected description column — if it only contains
          // generic banking words like DEBIT/CREDIT, it's the wrong column
          const JUNK_DESC = /^(debit|credit|ach|pos|atm|chk|check|wire|transfer|withdrawal|deposit|payment|purchase|fee|charge|debit card|credit card)$/i;
          if (colMap.descCol >= 0) {
            const sample = dataRows.slice(0, 10).map(r => (r[colMap.descCol] || "").trim());
            const allJunk = sample.filter(Boolean).every(v => JUNK_DESC.test(v));
            if (allJunk) colMap.descCol = -1; // reject — force column mapper
          }

          // Detect bank and always open mapper so user can verify/select bank
          let detectedBank = null;
          const headerStr = rawHeaders.map(h => h.toLowerCase()).join("|");
          if (headerStr.includes("posted date") && headerStr.includes("payee")) detectedBank = "bofa";
          else if (headerStr.includes("posting date") && headerStr.includes("description")) detectedBank = "chase";
          // Always show mapper — lets user pick bank & verify columns
          setModal({ type: "columnMapper", headers: rawHeaders, dataRows, colMap, detectedBank });
          return;

          dataRows.forEach((cols, i) => {
            const desc = cols[colMap.descCol] || `Transaction ${i + 1}`;
            let amount = 0;
            if (colMap.amtCol >= 0) amount = parseAmount(cols[colMap.amtCol]);
            else if (colMap.debitCol >= 0 || colMap.creditCol >= 0) {
              const d = colMap.debitCol >= 0 ? parseAmount(cols[colMap.debitCol]) : 0;
              const c = colMap.creditCol >= 0 ? parseAmount(cols[colMap.creditCol]) : 0;
              amount = c > 0 ? c : (d > 0 ? -d : 0);
            }
            const date = colMap.dateCol >= 0 ? cols[colMap.dateCol] : new Date().toISOString().split("T")[0];
            parsedRows.push({ id: `t_${Date.now()}_${i}`, date, description: desc.trim(), amount, categoryId: guessCategory(desc, categories, customKeywords), note: "" });
          });
        } else {
          const XLSX = window.XLSX;
          if (!XLSX) { notify("Excel support requires the XLSX library. Try CSV instead.", "info"); return; }
          const wb = XLSX.read(e.target.result, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
          json.forEach((row, i) => {
            const dateKey = Object.keys(row).find(k => /\bdate\b/i.test(k) && !/update/i.test(k));
            const descKey = Object.keys(row).find(k => /\b(payee|merchant|description|narration|memo|particulars|reference|details)\b/i.test(k));
            const amtKey = Object.keys(row).find(k => /^(amount|transaction amount|amt)$/i.test(k));
            const desc = (descKey && String(row[descKey])) || `Transaction ${i + 1}`;
            parsedRows.push({ id: `t_${Date.now()}_${i}`, date: (dateKey && row[dateKey]) || new Date().toISOString().split("T")[0], description: desc, amount: parseAmount(amtKey ? row[amtKey] : 0), categoryId: guessCategory(desc, categories, customKeywords), note: "" });
          });
        }

        const valid = parsedRows.filter(r => r.description && !isNaN(r.amount));
        setTransactions(prev => [...valid, ...prev]);
        notify(`✓ Imported ${valid.length} transactions!`);
      } catch (err) {
        notify("Could not parse file. Please check the format.", "error");
        console.error(err);
      }
    };
    if (ext === "csv") reader.readAsText(file);
    else reader.readAsBinaryString(file);
  }, [categories]);

  // ── Computed ─────────────────────────────────────────────────────────────
  // Filter transactions to selected date range
  const rangeStart = dateRange.start ? new Date(dateRange.start + "T00:00:00") : null;
  const rangeEnd   = dateRange.end   ? new Date(dateRange.end   + "T23:59:59") : null;

  // Normalize various date formats to a comparable Date object
  const parseDate = (raw) => {
    if (!raw) return null;
    // Already ISO format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date(raw + "T12:00:00");
    // M/D/YY or MM/DD/YY or M/D/YYYY
    const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (slashMatch) {
      let [, m, d, y] = slashMatch;
      if (y.length === 2) y = "20" + y;
      return new Date(`${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}T12:00:00`);
    }
    // Fallback
    const d = new Date(raw);
    return isNaN(d) ? null : d;
  };

  const monthTxns = transactions.filter(t => {
    const d = parseDate(t.date);
    if (!d) return false;
    if (rangeStart && d < rangeStart) return false;
    if (rangeEnd   && d > rangeEnd)   return false;
    return true;
  });
  const rangeLabelShort = (() => {
    const fmtD = s => { if (!s) return ""; const [y,m,d] = s.split("-"); return `${m}/${d}/${y.slice(2)}`; };
    return dateRange.start === dateRange.end ? fmtD(dateRange.start) : `${fmtD(dateRange.start)} – ${fmtD(dateRange.end)}`;
  })();

  const totalIncome = monthTxns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = Math.abs(monthTxns.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const netBalance = totalIncome - totalExpense;
  const savings = monthTxns.filter(t => { const c = categories.find(c => c.id === t.categoryId); return c?.type === "savings" && t.amount < 0; }).reduce((s, t) => s + Math.abs(t.amount), 0);

  const expenseByCategory = categories.filter(c => c.type === "expense").map(c => ({
    name: c.name,
    value: Math.abs(monthTxns.filter(t => t.categoryId === c.id && t.amount < 0).reduce((s, t) => s + t.amount, 0)),
    color: c.color,
  })).filter(c => c.value > 0);

  const monthlyData = (() => {
    // Always show last 6 months of data for trend charts regardless of date range filter
    const map = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map[key] = { label: MONTHS[d.getMonth()] + " '" + d.getFullYear().toString().slice(2), income: 0, expenses: 0 };
    }
    transactions.forEach(t => {
      const raw = t.date;
      let d = null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) d = new Date(raw + "T12:00:00");
      else { const m = raw && raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/); if(m){let[,mo,dy,y]=m;if(y.length===2)y="20"+y;d=new Date(`${y}-${mo.padStart(2,"0")}-${dy.padStart(2,"0")}T12:00:00`);}else{d=new Date(raw);if(isNaN(d))d=null;} }
      if (!d) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) return; // outside 6-month window
      if (t.amount > 0) map[key].income += t.amount;
      else map[key].expenses += Math.abs(t.amount);
    });
    return Object.values(map);
  })();

  const savingsLine = (() => {
    let running = 0;
    return monthlyData.map(m => { running += (m.income - m.expenses); return { label: m.label, savings: Math.max(0, running) }; });
  })();

  const upcomingBills = bills.filter(b => !b.isPaid).sort((a, b) => a.dueDay - b.dueDay).slice(0, 5);
  const billsTotal = bills.reduce((s, b) => s + b.amount, 0);
  const paidCount = bills.filter(b => b.isPaid).length;

  // ── Tabs ─────────────────────────────────────────────────────────────────
  const NAV = [
    { id: "dashboard",    icon: TrendingUp, label: "Dashboard"    },
    { id: "transactions", icon: DollarSign, label: "Transactions" },
    { id: "categories",   icon: Tag,        label: "Categories"   },
    { id: "savings",      icon: PiggyBank,  label: "Savings"      },
    { id: "bills",        icon: CreditCard, label: "Bills"        },
    { id: "schedule",     icon: Calendar,   label: "Schedule"     },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: T.bg }}>
      <div style={{ fontFamily: "Syne", fontSize: 20, color: T.teal }} className="pulse">Loading your finances...</div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <StyleTag />

      {/* Notification */}
      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: notification.type === "error" ? "#FF6B6B20" : notification.type === "info" ? "#60A5FA20" : "#6BCB7720", border: `1px solid ${notification.type === "error" ? T.coral : notification.type === "info" ? T.blue : T.green}`, borderRadius: 12, padding: "12px 18px", color: T.text, fontSize: 14, backdropFilter: "blur(10px)", animation: "fadeIn 0.3s ease", maxWidth: 320 }}>
          {notification.msg}
        </div>
      )}

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199 }} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} style={{ width: 244, background: T.card, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "24px 12px", gap: 4, flexShrink: 0, position: "fixed", top: 0, left: 0, height: "100vh", overflowY: "auto", zIndex: 100 }}>
        <div style={{ padding: "0 8px 20px", borderBottom: `1px solid ${T.border}`, marginBottom: 8 }}>
          <div style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, color: T.text }}>
            <span style={{ color: T.teal }}>$</span>mart<span style={{ color: T.coral }}>Budget</span>
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Your financial co-pilot</div>
        </div>
        {NAV.map(n => (
          <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => { setTab(n.id); setSidebarOpen(false); }}>
            <n.icon size={17} />
            {n.label}
          </button>
        ))}
        {/* Date Range Picker */}
        <div style={{ padding: "14px 8px", borderTop: `1px solid ${T.border}`, marginTop: 8 }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Date Range</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <input type="date" className="input" style={{ fontSize: 12, padding: "6px 8px" }}
              value={dateRange.start}
              onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))} />
            <div style={{ fontSize: 10, color: T.muted, textAlign: "center" }}>to</div>
            <input type="date" className="input" style={{ fontSize: 12, padding: "6px 8px" }}
              value={dateRange.end}
              onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))} />
          </div>
          {/* Quick presets */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
            {[
              { label: "This Month", fn: () => { const n=new Date(),y=n.getFullYear(),m=n.getMonth(),fmt=d=>d.toISOString().split("T")[0]; setDateRange({ start: fmt(new Date(y,m,1)), end: fmt(new Date(y,m+1,0)) }); } },
              { label: "Last Month", fn: () => { const n=new Date(),y=n.getFullYear(),m=n.getMonth()-1,fmt=d=>d.toISOString().split("T")[0]; setDateRange({ start: fmt(new Date(y,m,1)), end: fmt(new Date(y,m+1,0)) }); } },
              { label: "Last 3 Mo",  fn: () => { const n=new Date(),fmt=d=>d.toISOString().split("T")[0]; setDateRange({ start: fmt(new Date(n.getFullYear(),n.getMonth()-2,1)), end: fmt(new Date(n.getFullYear(),n.getMonth()+1,0)) }); } },
              { label: "This Year",  fn: () => { const y=new Date().getFullYear(),fmt=d=>d.toISOString().split("T")[0]; setDateRange({ start: fmt(new Date(y,0,1)), end: fmt(new Date(y,11,31)) }); } },
            ].map(p => (
              <button key={p.label} onClick={p.fn}
                style={{ fontSize: 10, padding: "3px 7px", borderRadius: 6, background: "rgba(78,205,196,0.1)", border: `1px solid rgba(78,205,196,0.2)`, color: T.teal, cursor: "pointer", fontFamily: "DM Sans" }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 8px 0", borderTop: `1px solid ${T.border}` }}>
          <button className="btn btn-ghost" style={{ width: "100%", fontSize: 12, marginBottom: 12, justifyContent: "center" }}
            onClick={() => setModal({ type: "setupWizard" })}>
            ⚙️ Budget Setup
          </button>
          <div style={{ fontSize: 11, color: T.muted }}>Storage</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            {dbStatus === "connected" && <>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }} className="pulse" />
              <span style={{ fontSize: 11, color: T.green }}>Supabase connected</span>
            </>}
            {dbStatus === "local" && <>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.yellow }} />
              <span style={{ fontSize: 11, color: T.yellow }}>Saved locally</span>
            </>}
            {dbStatus === "checking" && <>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.muted }} className="pulse" />
              <span style={{ fontSize: 11, color: T.muted }}>Connecting...</span>
            </>}
          </div>
          {dbStatus === "local" && !isSupabaseReady() && (
            <div style={{ fontSize: 10, color: T.muted, marginTop: 4, lineHeight: 1.4 }}>Add your Supabase keys<br/>to sync across devices</div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="main-content" style={{ flex: 1, padding: "24px", overflowY: "auto", marginLeft: 244, minHeight: "100vh" }}>
        {/* Mobile header */}
        <div style={{ display: "none" }} className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: T.text, cursor: "pointer" }}>☰</button>
        </div>

        {/* ─ Dashboard ─ */}
        {tab === "dashboard" && (
          <div className="fade-in">
            <h1 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Overview</h1>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 24 }}>
              {transactions.length === 0 ? "Upload your bank transactions to get started →" : `Showing ${monthTxns.length} transactions · ${rangeLabelShort}`}
            </p>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
              <StatCard label="Total Income" value={fmt(totalIncome)} icon={TrendingUp} color={T.green} sub="All deposits" />
              <StatCard label="Total Expenses" value={fmt(totalExpense)} icon={TrendingDown} color={T.coral} sub="All withdrawals" />
              <StatCard label="Net Balance" value={fmt(netBalance)} icon={DollarSign} color={netBalance >= 0 ? T.teal : T.coral} sub={netBalance >= 0 ? "Looking good!" : "Overspent"} />
              <StatCard label="Bills Due" value={fmt(billsTotal)} icon={CreditCard} color={T.purple} sub={`${bills.length - paidCount} unpaid`} />
            </div>

            {/* Charts */}
            {transactions.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {/* Pie */}
                <div className="card">
                  <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 16 }}>Spending by Category</div>
                  {expenseByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                          {expenseByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: 40 }}>No expense data yet</div>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {expenseByCategory.slice(0, 5).map((c, i) => (
                      <span key={i} style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, display: "inline-block" }} />
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Line */}
                <div className="card">
                  <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 16 }}>Savings Trend</div>
                  {savingsLine.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={savingsLine}>
                        <defs>
                          <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={T.teal} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={T.teal} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                        <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13 }} />
                        <Area type="monotone" dataKey="savings" stroke={T.teal} strokeWidth={2} fill="url(#savGrad)" name="Cumulative Savings" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: 40 }}>Savings data will appear here</div>}
                </div>

                {/* Bar */}
                <div className="card" style={{ gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontFamily: "Syne", fontWeight: 600 }}>
                      {chartMode === "bar" ? "Income vs Expenses" : "Expense Flow"}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[{ id: "bar", label: "📊 Bar" }, { id: "sankey", label: "🌊 Sankey" }].map(m => (
                        <button key={m.id} onClick={() => setChartMode(m.id)}
                          style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, cursor: "pointer", fontFamily: "DM Sans",
                            background: chartMode === m.id ? T.teal : "rgba(255,255,255,0.05)",
                            color: chartMode === m.id ? "#0a0a1a" : T.muted,
                            border: `1px solid ${chartMode === m.id ? T.teal : T.border}` }}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {chartMode === "bar" && (
                    monthlyData.some(m => m.income > 0 || m.expenses > 0) ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={monthlyData.map(m => ({ ...m, expensesNeg: -m.expenses }))} barGap={2} barCategoryGap="25%">
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                          <XAxis dataKey="label" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false}
                            tickFormatter={v => `$${Math.abs(v/1000).toFixed(1)}k`} />
                          <Tooltip formatter={(v, name) => [fmt(Math.abs(v)), name]}
                            contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13 }} />
                          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                          <Bar dataKey="income" fill="#A78BFA" radius={[4, 4, 0, 0]} name="Income" />
                          <Bar dataKey="expensesNeg" fill="#4ADE80" radius={[0, 0, 4, 4]} name="Expenses" />
                          <Legend formatter={(v) => v === "expensesNeg" ? "Expenses" : v} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: 40 }}>Upload transactions to see monthly trends</div>
                  )}

                  {chartMode === "sankey" && (() => {
                    // Build Sankey: Income node → expense category nodes
                    const sankeyData = expenseByCategory.filter(c => c.value > 0).sort((a,b) => b.value - a.value).slice(0, 10);
                    const totalFlow = sankeyData.reduce((s, c) => s + c.value, 0);
                    if (totalFlow === 0) return <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: 40 }}>No expense data for selected period</div>;
                    const H = 300, W = 560, nodeW = 18, pad = 8, leftX = 20, rightX = W - nodeW - 20;
                    // Position right nodes evenly
                    const totalH = H - (sankeyData.length - 1) * pad;
                    let rightY = 0;
                    const nodes = sankeyData.map(c => {
                      const h = Math.max(12, (c.value / totalFlow) * totalH);
                      const y = rightY;
                      rightY += h + pad;
                      return { ...c, h, y };
                    });
                    return (
                      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 300 }}>
                        {/* Income source node */}
                        <rect x={leftX} y={0} width={nodeW} height={H} rx={4} fill="#A78BFA" />
                        <text x={leftX + nodeW + 6} y={H/2} fill={T.text} fontSize={11} dominantBaseline="middle" fontFamily="DM Sans">{fmt(totalFlow)}</text>
                        <text x={leftX + nodeW + 6} y={H/2 - 14} fill={T.muted} fontSize={10} dominantBaseline="middle" fontFamily="DM Sans">Total Expenses</text>
                        {/* Flow paths + destination nodes */}
                        {nodes.map((c, i) => {
                          const srcY0 = (c.y / (rightY - pad)) * H;
                          const srcY1 = srcY0 + (c.h / (rightY - pad)) * H;
                          const dstY0 = c.y * (H / (rightY - pad));
                          const dstY1 = dstY0 + c.h * (H / (rightY - pad));
                          const mx = (leftX + nodeW + rightX) / 2;
                          const path = `M${leftX + nodeW},${srcY0} C${mx},${srcY0} ${mx},${dstY0} ${rightX},${dstY0} L${rightX},${dstY1} C${mx},${dstY1} ${mx},${srcY1} ${leftX+nodeW},${srcY1} Z`;
                          return (
                            <g key={c.name}>
                              <path d={path} fill={c.color} opacity={0.35} />
                              <rect x={rightX} y={dstY0} width={nodeW} height={Math.max(2, dstY1-dstY0)} rx={3} fill={c.color} />
                              <text x={rightX + nodeW + 6} y={dstY0 + (dstY1-dstY0)/2} fill={T.text} fontSize={10} dominantBaseline="middle" fontFamily="DM Sans">
                                {c.name} · {fmt(c.value)}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    );
                  })()}
                </div>

              </div>
            ) : (
              /* Upload prompt on dashboard */
              <div className="card" style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No transactions yet</div>
                <div style={{ color: T.muted, marginBottom: 20, fontSize: 14 }}>Upload a bank statement to unlock your full dashboard</div>
                <button className="btn btn-primary" onClick={() => setTab("transactions")}>
                  <Upload size={15} /> Go to Transactions
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─ Transactions ─ */}
        {tab === "transactions" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700 }}>Transactions</h1>
                <p style={{ color: T.muted, fontSize: 14 }}>{transactions.length} total transactions</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
                  <Upload size={15} /> Upload File
                </button>
                <button className="btn btn-ghost" onClick={() => setModal({ type: "addTransaction" })}>
                  <Plus size={15} /> Add Manual
                </button>
              </div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.pdf" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
            </div>

            {/* Drop zone */}
            <div className={`upload-zone ${uploadDrag ? "dragover" : ""}`} style={{ marginBottom: 20 }}
              onDragOver={e => { e.preventDefault(); setUploadDrag(true); }}
              onDragLeave={() => setUploadDrag(false)}
              onDrop={e => { e.preventDefault(); setUploadDrag(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}>
              <Upload size={28} color={T.teal} style={{ margin: "0 auto 8px" }} />
              <div style={{ fontWeight: 500 }}>Drop your bank statement here</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Supports CSV and Excel (.xlsx) files</div>
            </div>

            {transactions.length > 0 ? (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        {[
                          { key: "date", label: "Date" },
                          { key: "description", label: "Description" },
                          { key: "category", label: "Category" },
                          { key: "amount", label: "Amount", right: true },
                        ].map(col => (
                          <th key={col.key} style={{ textAlign: col.right ? "right" : "left", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
                            onClick={() => { if (sortCol === col.key) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortCol(col.key); setSortDir(col.key === "amount" ? "desc" : "asc"); } }}>
                            {col.label}
                            <span style={{ marginLeft: 4, opacity: sortCol === col.key ? 1 : 0.3, fontSize: 10 }}>
                              {sortCol === col.key ? (sortDir === "asc" ? "▲" : "▼") : "▲▼"}
                            </span>
                          </th>
                        ))}
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...transactions].sort((a, b) => {
                        const dir = sortDir === "asc" ? 1 : -1;
                        if (sortCol === "date") {
                          const da = new Date(a.date), db = new Date(b.date);
                          return (da - db) * dir;
                        }
                        if (sortCol === "amount") return (a.amount - b.amount) * dir;
                        if (sortCol === "description") return a.description.localeCompare(b.description) * dir;
                        if (sortCol === "category") {
                          const ca = categories.find(c => c.id === a.categoryId)?.name || "";
                          const cb = categories.find(c => c.id === b.categoryId)?.name || "";
                          return ca.localeCompare(cb) * dir;
                        }
                        return 0;
                      }).slice(0, 200).map(t => {
                        const cat = categories.find(c => c.id === t.categoryId);
                        return (
                          <tr key={t.id}>
                            <td style={{ color: T.muted, fontSize: 12, whiteSpace: "nowrap" }}>{t.date}</td>
                            <td style={{ maxWidth: 260 }}>
                              <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 }} title={t.description}>{t.description}</div>
                              {t.note && <div style={{ fontSize: 11, color: T.muted }}>{t.note}</div>}
                            </td>
                            <td>
                              <select className="input" style={{ width: "auto", padding: "4px 8px", fontSize: 12 }}
                                value={t.categoryId || ""}
                                onChange={e => setTransactions(prev => prev.map(x => x.id === t.id ? { ...x, categoryId: e.target.value } : x))}>
                                <option value="">— Uncategorized —</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 600, color: t.amount >= 0 ? T.green : T.coral, whiteSpace: "nowrap" }}>
                              {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
                            </td>
                            <td>
                              <button className="btn btn-danger" style={{ padding: "4px 8px" }} onClick={() => { setTransactions(prev => prev.filter(x => x.id !== t.id)); if(dbStatus==="connected") sb.remove("transactions", t.id); }}>
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {transactions.length > 100 && <div style={{ padding: 14, textAlign: "center", color: T.muted, fontSize: 13 }}>Showing first 100 of {transactions.length} transactions</div>}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: T.muted }}>No transactions yet. Upload a file to get started!</div>
            )}
          </div>
        )}

        {/* ─ Categories ─ */}
        {tab === "categories" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700 }}>Categories</h1>
                <p style={{ color: T.muted, fontSize: 14 }}>Organize and set budgets</p>
              </div>
              <button className="btn btn-primary" onClick={() => setModal({ type: "addCategory" })}>
                <Plus size={15} /> Add Category
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {categories.filter(cat => cat.type !== "savings").map(cat => {
                const catTxns = transactions.filter(t => t.categoryId === cat.id);
                const catMonthTxns = monthTxns.filter(t => t.categoryId === cat.id);
                const spent = Math.abs(catMonthTxns.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
                const pct = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0;
                const over = cat.budget > 0 && spent > cat.budget;
                const txnCount = catMonthTxns.length;
                return (
                  <div key={cat.id} className="card" style={{ position: "relative", cursor: txnCount > 0 ? "pointer" : "default", transition: "border-color 0.2s", borderColor: T.border }}
                    onClick={() => txnCount > 0 && setModal({ type: "categoryDrilldown", cat, dateRange })}
                    onMouseEnter={e => { if (txnCount > 0) e.currentTarget.style.borderColor = cat.color; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, boxShadow: `0 0 8px ${cat.color}60` }} />
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        <span className="tag" style={{ background: `rgba(255,255,255,0.06)`, color: T.muted, fontSize: 10 }}>{cat.type}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {txnCount > 0 && (
                          <span style={{ fontSize: 11, color: cat.color, background: `${cat.color}15`, padding: "2px 8px", borderRadius: 20 }}>
                            {txnCount} txn{txnCount !== 1 ? "s" : ""}
                          </span>
                        )}
                        <button className="btn btn-ghost" style={{ padding: "3px 7px" }}
                          onClick={e => { e.stopPropagation(); setModal({ type: "editCategory", cat }); }}>
                          <Edit2 size={12} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: "3px 7px" }}
                          onClick={e => { e.stopPropagation(); setCategories(prev => prev.filter(c => c.id !== cat.id)); if(dbStatus==="connected") sb.remove("categories", cat.id); }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: T.muted }}>Spent this period</span>
                      <span style={{ fontSize: 13, color: over ? T.coral : T.text }}>{fmt(spent)} {cat.budget > 0 && `/ ${fmt(cat.budget)}`}</span>
                    </div>
                    {cat.budget > 0 && (
                      <>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: over ? T.coral : cat.color }} />
                        </div>
                        {over && <div style={{ fontSize: 11, color: T.coral, marginTop: 4 }}>⚠ Over budget by {fmt(spent - cat.budget)}</div>}
                      </>
                    )}
                    {txnCount > 0 && (
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                        <span>Click to view transactions</span>
                        <ArrowRight size={11} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Keyword Manager ── */}
            <div style={{ marginTop: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700 }}>Keyword Rules</div>
                  <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>
                    When a transaction description contains a keyword, it auto-assigns that category.
                    Your custom rules are checked <span style={{ color: T.teal }}>first</span>.
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => setModal({ type: "addKeyword" })}>
                  <Plus size={15} /> Add Rule
                </button>
              </div>

              {/* Custom keywords */}
              {customKeywords.length > 0 && (
                <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, fontSize: 12, fontWeight: 600, color: T.teal, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Your Custom Rules ({customKeywords.length})
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table>
                      <thead><tr><th>Keyword</th><th>Category</th><th></th></tr></thead>
                      <tbody>
                        {customKeywords.map(kw => {
                          const cat = categories.find(c => c.id === kw.categoryId);
                          return (
                            <tr key={kw.id}>
                              <td><span style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 6, fontSize: 13 }}>{kw.keyword}</span></td>
                              <td><CategoryBadge category={cat} /></td>
                              <td>
                                <button className="btn btn-danger" style={{ padding: "4px 8px" }}
                                  onClick={() => { setCustomKeywords(prev => prev.filter(k => k.id !== kw.id)); if(dbStatus==="connected") sb.remove("custom_keywords", kw.id); }}>
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Built-in default keywords (read-only, collapsible) */}
              <details>
                <summary style={{ cursor: "pointer", color: T.muted, fontSize: 13, userSelect: "none", padding: "8px 0" }}>
                  View {DEFAULT_KEYWORDS.length} built-in keyword rules (read-only)
                </summary>
                <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 10 }}>
                  <div style={{ overflowX: "auto", maxHeight: 320, overflowY: "auto" }}>
                    <table>
                      <thead><tr><th>Keyword</th><th>Category</th></tr></thead>
                      <tbody>
                        {DEFAULT_KEYWORDS.map(kw => {
                          const cat = categories.find(c => c.id === kw.categoryId);
                          return (
                            <tr key={kw.id}>
                              <td><span style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{kw.keyword}</span></td>
                              <td><CategoryBadge category={cat} /></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}

        {/* ─ Savings ─ */}
        {tab === "savings" && (() => {
          // Pull all transactions tagged to savings-type categories
          const savCatIds = categories.filter(c => c.type === "savings").map(c => c.id);
          const savTxns = transactions.filter(t => savCatIds.includes(t.categoryId));
          const totalSaved = savTxns.reduce((s, t) => s + Math.abs(t.amount), 0);
          const totalManual = savingsGoals.reduce((s, g) => s + (g.manualAmount || 0), 0);
          const totalGoalTarget = savingsGoals.reduce((s, g) => s + (g.targetAmount || 0), 0);
          const overallPct = totalGoalTarget > 0 ? Math.min((totalSaved / totalGoalTarget) * 100, 100) : 0;

          return (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h1 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700 }}>Savings</h1>
                  <p style={{ color: T.muted, fontSize: 14 }}>Track your goals and watch them grow</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModal({ type: "addSavingsGoal" })}>
                  <Plus size={15} /> Add Goal
                </button>
              </div>

              {/* Total savings summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
                <div className="card" style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(78,205,196,0.08))", border: `1px solid rgba(74,222,128,0.25)` }}>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Total Saved</div>
                  <div style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 800, color: "#4ADE80" }}>{fmt(totalSaved)}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Across all savings categories</div>
                </div>
                <div className="card">
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Total Goal Target</div>
                  <div style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 800, color: T.teal }}>{fmt(totalGoalTarget)}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{savingsGoals.length} active goal{savingsGoals.length !== 1 ? "s" : ""}</div>
                </div>
                <div className="card">
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Overall Progress</div>
                  <div style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 800, color: T.yellow }}>{overallPct.toFixed(0)}%</div>
                  <div style={{ marginTop: 8 }}>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <div className="progress-fill" style={{ width: `${overallPct}%`, background: `linear-gradient(90deg, #4ADE80, ${T.teal})` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual goals */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {savingsGoals.map(goal => {
                  // Saved amount = transactions in categories matching this goal's linkedCategoryId, or all savings if unlinked
                  // Sum all savings transactions assigned to this goal via dropdown
                  const assignedTxns = transactions.filter(t => t.goalId === goal.id);
                  const goalSaved = assignedTxns.reduce((s, t) => s + Math.abs(t.amount), 0);
                  const manualSaved = goal.manualAmount || 0;
                  const totalGoalSaved = goalSaved + manualSaved;
                  const pct = goal.targetAmount > 0 ? Math.min((totalGoalSaved / goal.targetAmount) * 100, 100) : 0;
                  const remaining = Math.max(0, (goal.targetAmount || 0) - totalGoalSaved);
                  const isComplete = pct >= 100;

                  return (
                    <div key={goal.id} className="card" style={{ border: `1px solid ${isComplete ? goal.color : T.border}`, position: "relative", overflow: "hidden" }}>
                      {/* Completion glow */}
                      {isComplete && <div style={{ position: "absolute", inset: 0, background: `${goal.color}08`, pointerEvents: "none" }} />}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 24 }}>{goal.emoji || "🎯"}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>{goal.name}</div>
                            {goal.note && <div style={{ fontSize: 12, color: T.muted }}>{goal.note}</div>}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost" style={{ padding: "3px 7px" }}
                            onClick={() => setModal({ type: "editSavingsGoal", goal })}>
                            <Edit2 size={12} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: "3px 7px" }}
                            onClick={() => { setSavingsGoals(prev => prev.filter(g => g.id !== goal.id)); if(dbStatus==="connected") sb.remove("savings_goals", goal.id); }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: goal.color }}>
                            {fmt(totalGoalSaved)}
                          </span>
                          <span style={{ fontSize: 13, color: T.muted }}>of {fmt(goal.targetAmount)}</span>
                        </div>
                        <div className="progress-bar" style={{ height: 10, borderRadius: 6 }}>
                          <div className="progress-fill" style={{ width: `${pct}%`, background: isComplete ? `linear-gradient(90deg, ${goal.color}, #fff8)` : goal.color, borderRadius: 6, transition: "width 0.8s ease" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                          <span style={{ fontSize: 12, color: isComplete ? goal.color : T.muted }}>
                            {isComplete ? "🎉 Goal reached!" : `${pct.toFixed(0)}% complete`}
                          </span>
                          {!isComplete && <span style={{ fontSize: 12, color: T.muted }}>{fmt(remaining)} to go</span>}
                        </div>
                      </div>

                      {/* Manual amount input */}
                      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, marginTop: 4 }}>
                        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Manually track saved amount:</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            type="number"
                            className="input"
                            placeholder="0.00"
                            defaultValue={goal.manualAmount || ""}
                            style={{ fontSize: 13, padding: "6px 10px" }}
                            onBlur={e => {
                              const val = parseFloat(e.target.value) || 0;
                              setSavingsGoals(prev => prev.map(g => g.id === goal.id ? { ...g, manualAmount: val } : g));
                            }}
                          />
                          <span style={{ fontSize: 12, color: T.muted, alignSelf: "center", whiteSpace: "nowrap" }}>saved so far</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty state */}
                {savingsGoals.length === 0 && (
                  <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: 60 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🐷</div>
                    <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No savings goals yet</div>
                    <div style={{ color: T.muted, marginBottom: 20, fontSize: 14 }}>Set a goal and start tracking your progress!</div>
                    <button className="btn btn-primary" onClick={() => setModal({ type: "addSavingsGoal" })}>
                      <Plus size={15} /> Add Your First Goal
                    </button>
                  </div>
                )}
              </div>

              {/* Recent savings transactions */}
              {savTxns.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Recent Savings Transactions</div>
                  <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Savings Goal</th>
                            <th style={{ textAlign: "right" }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {savTxns.slice(0, 50).map(t => {
                            const cat = categories.find(c => c.id === t.categoryId);
                            return (
                              <tr key={t.id}>
                                <td style={{ color: T.muted, fontSize: 12, whiteSpace: "nowrap" }}>{t.date}</td>
                                <td style={{ fontSize: 13, fontWeight: 500, maxWidth: 260 }}>
                                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={t.description}>{t.description}</div>
                                </td>
                                <td>
                                  <select
                                    style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 8px", color: T.text, fontSize: 12, outline: "none", cursor: "pointer", minWidth: 130 }}
                                    value={t.goalId || ""}
                                    onChange={e => setTransactions(prev => prev.map(x => x.id === t.id ? { ...x, goalId: e.target.value || null } : x))}>
                                    <option value="">— Unassigned —</option>
                                    {savingsGoals.map(g => <option key={g.id} value={g.id} style={{ background: T.card }}>{g.emoji} {g.name}</option>)}
                                  </select>
                                </td>
                                <td style={{ textAlign: "right", fontWeight: 600, color: "#4ADE80", whiteSpace: "nowrap" }}>+{fmt(Math.abs(t.amount))}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ─ Bills ─ */}
        {tab === "bills" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700 }}>Bills</h1>
                <p style={{ color: T.muted, fontSize: 14 }}>{bills.filter(b => !b.isPaid).length} unpaid · {fmt(bills.filter(b => !b.isPaid).reduce((s, b) => s + b.amount, 0))} due</p>
              </div>
              <button className="btn btn-primary" onClick={() => setModal({ type: "addBill" })}>
                <Plus size={15} /> Add Bill
              </button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {bills.sort((a, b) => a.dueDay - b.dueDay).map(bill => {
                const cat = categories.find(c => c.id === bill.categoryId);
                return (
                  <div key={bill.id} className="card" style={{ display: "flex", alignItems: "center", gap: 14, opacity: bill.isPaid ? 0.55 : 1 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: bill.isPaid ? T.green : T.muted, flexShrink: 0 }}
                      onClick={() => setBills(prev => prev.map(b => b.id === bill.id ? { ...b, isPaid: !b.isPaid } : b))}>
                      {bill.isPaid ? <CheckCircle size={22} /> : <Circle size={22} />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, textDecoration: bill.isPaid ? "line-through" : "none" }}>{bill.name}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                        Due day {bill.dueDay} of month · <CategoryBadge category={cat} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: bill.isPaid ? T.muted : T.coral }}>{fmt(bill.amount)}</div>
                      {bill.isRecurring && <div style={{ fontSize: 10, color: T.muted }}>Monthly</div>}
                    </div>
                    <button className="btn btn-danger" style={{ padding: "5px 8px" }} onClick={() => { setBills(prev => prev.filter(b => b.id !== bill.id)); if(dbStatus==="connected") sb.remove("bills", bill.id); }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
              {bills.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.muted }}>No bills yet. Add your recurring bills!</div>}
            </div>
          </div>
        )}

        {/* ─ Schedule ─ */}
        {tab === "schedule" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700 }}>Financial Schedule</h1>
                <p style={{ color: T.muted, fontSize: 14 }}>Upcoming transfers & payments</p>
              </div>
              <button className="btn btn-primary" onClick={() => setModal({ type: "addSchedule" })}>
                <Plus size={15} /> Add Event
              </button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {schedule.sort((a, b) => new Date(a.date) - new Date(b.date)).map(ev => {
                const d = new Date(ev.date);
                const isPast = d < new Date();
                return (
                  <div key={ev.id} className="card" style={{ display: "flex", alignItems: "center", gap: 16, borderLeft: `3px solid ${ev.type === "transfer" ? T.teal : ev.type === "bill" ? T.coral : T.yellow}` }}>
                    <div style={{ textAlign: "center", minWidth: 44 }}>
                      <div style={{ fontSize: 20, fontFamily: "Syne", fontWeight: 700, color: T.text }}>{d.getDate()}</div>
                      <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase" }}>{MONTHS[d.getMonth()]}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{ev.note}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                        {ev.from} → {ev.to}
                        {isPast && <span style={{ color: T.coral, marginLeft: 8 }}>· Past due</span>}
                      </div>
                    </div>
                    <div style={{ fontFamily: "Syne", fontWeight: 700, color: ev.type === "transfer" ? T.teal : T.coral }}>{fmt(ev.amount)}</div>
                    <button className="btn btn-danger" style={{ padding: "5px 8px" }} onClick={() => { setSchedule(prev => prev.filter(s => s.id !== ev.id)); if(dbStatus==="connected") sb.remove("schedule", ev.id); }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
              {schedule.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.muted }}>No scheduled events. Add transfers and reminders!</div>}
            </div>
          </div>
        )}
      </main>

      {/* ─ Modals ─ */}
      {modal && <Modal modal={modal} setModal={setModal} categories={categories} setCategories={setCategories} bills={bills} setBills={setBills} schedule={schedule} setSchedule={setSchedule} transactions={transactions} setTransactions={setTransactions} customKeywords={customKeywords} setCustomKeywords={setCustomKeywords} savingsGoals={savingsGoals} setSavingsGoals={setSavingsGoals} dbStatus={dbStatus} notify={notify} guessCategory={guessCategory} />}
    </div>
  );
}

// ─── Category Drilldown Component ────────────────────────────────────────────
function CategoryDrilldown({ modal, categories, transactions, setTransactions, dbStatus, notify, close }) {
  const { cat } = modal;
  const [search, setSearch] = useState("");

  const { dateRange } = modal;
  const rStart = dateRange?.start ? new Date(dateRange.start + "T00:00:00") : null;
  const rEnd   = dateRange?.end   ? new Date(dateRange.end   + "T23:59:59") : null;
  const parseDateLocal = (raw) => {
    if (!raw) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date(raw + "T12:00:00");
    const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (m) { let [,mo,d,y]=m; if(y.length===2)y="20"+y; return new Date(`${y}-${mo.padStart(2,"0")}-${d.padStart(2,"0")}T12:00:00`); }
    const d2 = new Date(raw); return isNaN(d2) ? null : d2;
  };
  const catTxns = transactions
    .filter(t => t.categoryId === cat.id)
    .filter(t => {
      const d = parseDateLocal(t.date);
      if (!d) return true;
      if (rStart && d < rStart) return false;
      if (rEnd   && d > rEnd)   return false;
      return true;
    })
    .filter(t => search === "" || t.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = catTxns.reduce((s, t) => s + t.amount, 0);
  const fmtD = s => { if (!s) return ""; const [y,m,d] = s.split("-"); return `${m}/${d}/${y.slice(2)}`; };
  const monthLabel = dateRange?.start ? `${fmtD(dateRange.start)}–${fmtD(dateRange.end)}` : "All Time";
  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n || 0);

  const recat = (txnId, newCatId) => {
    setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, categoryId: newCatId } : t));
    if (dbStatus === "connected") sb.update("transactions", txnId, { category_id: newCatId }).catch(() => {});
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Summary bar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, background: `${cat.color}12`, border: `1px solid ${cat.color}30`, borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: T.muted }}>Transactions in {monthLabel}</div>
          <div style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: cat.color }}>{catTxns.length}</div>
        </div>
        <div style={{ flex: 1, background: `${cat.color}12`, border: `1px solid ${cat.color}30`, borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, color: T.muted }}>Total Spent in {monthLabel}</div>
          <div style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, color: cat.color }}>
            {fmt(Math.abs(catTxns.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)))}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        className="input"
        placeholder="Search transactions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ fontSize: 13 }}
      />

      {/* Transaction list */}
      <div style={{ maxHeight: 420, overflowY: "auto", borderRadius: 10, border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.02)" }}>
        {catTxns.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: T.muted, fontSize: 13 }}>
            {search ? "No matching transactions" : "No transactions in this category"}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: T.muted, borderBottom: `1px solid ${T.border}` }}>Date</th>
                <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: T.muted, borderBottom: `1px solid ${T.border}` }}>Description</th>
                <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: T.muted, borderBottom: `1px solid ${T.border}` }}>Move to</th>
                <th style={{ textAlign: "right", padding: "10px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: T.muted, borderBottom: `1px solid ${T.border}` }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {catTxns.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < catTxns.length - 1 ? `1px solid rgba(42,40,80,0.5)` : "none" }}>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>{t.date}</td>
                  <td style={{ padding: "10px 14px", maxWidth: 200 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={t.description}>
                      {t.description}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <select
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 8px", color: T.text, fontSize: 12, outline: "none", cursor: "pointer" }}
                      value={t.categoryId || ""}
                      onChange={e => recat(t.id, e.target.value)}>
                      {categories.map(c => <option key={c.id} value={c.id} style={{ background: T.card }}>{c.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontSize: 13, color: t.amount >= 0 ? T.green : T.coral, whiteSpace: "nowrap" }}>
                    {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ fontSize: 12, color: T.muted, textAlign: "center" }}>
        Changes save automatically. Reassigning a transaction moves it out of this category immediately.
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary" onClick={close}>Done</button>
      </div>
    </div>
  );
}


// ─── Setup Wizard Component ───────────────────────────────────────────────────
const WIZARD_STEPS = [
  { id: "welcome",    title: "Welcome to $martBudget!",     subtitle: "Let's set up your budget in about 2 minutes." },
  { id: "housing",   title: "Housing",                      subtitle: "What is your monthly rent or mortgage payment?" },
  { id: "transport", title: "Car & Transportation",         subtitle: "Set your monthly car-related budgets." },
  { id: "insurance", title: "Insurance",                    subtitle: "Enter your monthly insurance costs." },
  { id: "utilities", title: "Utilities & Bills",            subtitle: "What do you typically pay each month?" },
  { id: "food",      title: "Food & Groceries",             subtitle: "Set your monthly food budgets." },
  { id: "income",    title: "Income Keyword",               subtitle: "What word appears in your paycheck on your bank statement?" },
  { id: "done",      title: "You're all set! 🎉",           subtitle: "Your budgets have been saved." },
];

function SetupWizard({ categories, setCategories, setCustomKeywords, onComplete }) {
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState({
    rent: "", car_payment: "", gasoline: "", car_insurance: "",
    health_ins: "", dental: "", electricity: "", wifi: "", phone: "",
    food: "", grocery: "",
    income_kw1: "direct deposit", income_kw2: "", income_kw3: "",
  });

  const set = (k, v) => setVals(prev => ({ ...prev, [k]: v }));
  const renderField = (label, field, placeholder = "0.00", prefix = "$") => (
    <div>
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 5 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={{ padding: "9px 10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: 14, color: T.muted }}>{prefix}</span>
        <input type="number" className="input" placeholder={placeholder}
          value={vals[field]}
          onChange={e => set(field, e.target.value)}
          style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
      </div>
    </div>
  );
  const pct = Math.round((step / (WIZARD_STEPS.length - 1)) * 100);

  const applyAndFinish = () => {
    // Update category budgets
    const budgetMap = {
      housing:     parseFloat(vals.rent)           || 0,
      car_payment: parseFloat(vals.car_payment)    || 0,
      gasoline:    parseFloat(vals.gasoline)       || 0,
      health_ins:  parseFloat(vals.health_ins)     || 0,
      dental:      parseFloat(vals.dental)         || 0,
      electricity: parseFloat(vals.electricity)    || 0,
      wifi:        parseFloat(vals.wifi)           || 0,
      phone:       parseFloat(vals.phone)          || 0,
      food:        parseFloat(vals.food)           || 0,
      grocery:     parseFloat(vals.grocery)        || 0,
    };
    setCategories(prev => prev.map(c =>
      budgetMap[c.id] !== undefined && budgetMap[c.id] > 0
        ? { ...c, budget: budgetMap[c.id] }
        : c
    ));
    // Add all income keywords provided
    const incomeKws = [vals.income_kw1, vals.income_kw2, vals.income_kw3]
      .map(k => k.trim().toLowerCase()).filter(Boolean);
    if (incomeKws.length) {
      setCustomKeywords(prev => {
        let updated = [...prev];
        incomeKws.forEach((kw, i) => {
          if (!updated.some(k => k.keyword === kw)) {
            updated.push({ id: `kw_inc_${Date.now()}_${i}`, keyword: kw, categoryId: "income" });
          }
        });
        return updated;
      });
    }
    // Car insurance — add as custom keyword rule + category if not exists
    if (vals.car_insurance && parseFloat(vals.car_insurance) > 0) {
      setCategories(prev => {
        if (prev.some(c => c.id === "car_insurance")) {
          return prev.map(c => c.id === "car_insurance" ? { ...c, budget: parseFloat(vals.car_insurance) } : c);
        }
        return [...prev, { id: "car_insurance", name: "Car Insurance", color: "#FBBF24", budget: parseFloat(vals.car_insurance), type: "expense" }];
      });
    }
    // budgets saved — next() will advance to done screen then close on "Get Started!"
  };

  const next = () => {
    const lastDataStep = WIZARD_STEPS.length - 2; // step before "done"
    if (step < lastDataStep) {
      setStep(s => s + 1);
    } else if (step === lastDataStep) {
      applyAndFinish(); // save everything, then advance to done screen
      setStep(s => s + 1);
    } else {
      // On done screen — just close
      onComplete();
    }
  };
  const back = () => setStep(s => Math.max(0, s - 1));

  const s = WIZARD_STEPS[step];


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Progress bar — sticky so it never scrolls away */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: T.card, paddingBottom: 16, marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700 }}>{s.title}</span>
          <span style={{ fontSize: 12, color: T.teal }}>{step + 1} / {WIZARD_STEPS.length}</span>
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${T.teal}, #A78BFA)`, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{pct}% complete</div>
      </div>

      {/* Step subtitle */}
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 20, lineHeight: 1.5 }}>{s.subtitle}</div>

      {/* Step content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 160 }}>
        {step === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>💰</div>
            <div style={{ color: T.muted, fontSize: 14, lineHeight: 1.7 }}>
              We'll walk you through setting your monthly budgets<br/>for the most common expense categories.<br/><br/>
              <span style={{ color: T.teal }}>You can always change these later</span> in the Categories tab.
            </div>
          </div>
        )}
        {step === 1 && renderField("Monthly Rent or Mortgage", "rent", "0.00")}
        {step === 2 && <>
          {renderField("Monthly Car Payment", "car_payment", "0.00")}
          {renderField("Monthly Gas Budget", "gasoline", "0.00")}
        </>}
        {step === 3 && <>
          {renderField("Monthly Health Insurance", "health_ins", "0.00")}
          {renderField("Monthly Dental Insurance", "dental", "0.00")}
          {renderField("Monthly Car Insurance", "car_insurance", "0.00")}
        </>}
        {step === 4 && <>
          {renderField("Monthly Electricity Bill", "electricity", "0.00")}
          {renderField("Monthly Wi-Fi / Internet", "wifi", "0.00")}
          {renderField("Monthly Phone Bill", "phone", "0.00")}
        </>}
        {step === 5 && <>
          {renderField("Monthly Food & Dining Budget", "food", "0.00")}
          {renderField("Monthly Grocery Budget", "grocery", "0.00")}
        </>}
        {step === 6 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
              Add up to 3 keywords or phrases that appear in your income transactions —
              like your employer name, <span style={{ color: T.teal }}>"direct deposit"</span>, or a side income source.
            </div>
            {[
              { field: 'income_kw1', label: 'Primary income (e.g. employer name or "direct deposit")', required: true },
              { field: "income_kw2", label: "Second income source (optional)" },
              { field: "income_kw3", label: "Third income source (optional)" },
            ].map(({ field, label, required }) => (
              <div key={field}>
                <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>
                  {label} {required && <span style={{ color: T.coral }}>*</span>}
                </div>
                <input className="input" placeholder="e.g. acme corp, zelle, freelance..."
                  value={vals[field]}
                  onChange={e => set(field, e.target.value)} />
              </div>
            ))}
          </div>
        )}
        {step === WIZARD_STEPS.length - 1 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
            <div style={{ color: T.muted, fontSize: 14, lineHeight: 1.7 }}>
              Your budgets are saved. Upload a bank statement in the<br/><strong style={{ color: T.text }}>Transactions</strong> tab to see everything in action.<br/><br/>
              You can re-run this wizard anytime via<br/><span style={{ color: T.teal }}>⚙️ Budget Setup</span> in the sidebar.
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <div>
          {step > 0 && step < WIZARD_STEPS.length - 1 && (
            <button className="btn btn-ghost" onClick={back}>← Back</button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {step < WIZARD_STEPS.length - 1 && (
            <button className="btn btn-ghost" onClick={onComplete}>Skip setup</button>
          )}
          <button className="btn btn-primary" onClick={next}>
            {step === WIZARD_STEPS.length - 2 ? "Save & Finish →" : step === WIZARD_STEPS.length - 1 ? "Get Started! 🚀" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Column Mapper Component ─────────────────────────────────────────────────
function ColumnMapper({ modal, categories, customKeywords, setTransactions, notify, close, guessCategory }) {
  const { headers, dataRows, colMap, detectedBank } = modal;

  // Build initial map — prefer detected bank preset if available
  const buildMapFromPreset = (bankKey, hdrs) => {
    const p = BANK_PRESETS[bankKey];
    if (!p) return null;
    const h = hdrs.map(x => (x||"").toLowerCase().trim());
    if (p.hasHeaders) {
      return {
        date:   h.indexOf(p.date),
        desc:   h.indexOf(p.desc),
        amount: p.amount ? h.indexOf(p.amount) : -1,
        debit:  p.debit  ? h.indexOf(p.debit)  : -1,
        credit: p.credit ? h.indexOf(p.credit)  : -1,
      };
    } else {
      // Positional (no headers)
      return { date: p.date, desc: p.desc, amount: p.amount ?? -1, debit: p.debit ?? -1, credit: p.credit ?? -1 };
    }
  };

  const defaultMap = detectedBank
    ? (buildMapFromPreset(detectedBank, headers) || { date: colMap.dateCol >= 0 ? colMap.dateCol : -1, desc: colMap.descCol >= 0 ? colMap.descCol : -1, amount: colMap.amtCol >= 0 ? colMap.amtCol : -1, debit: colMap.debitCol >= 0 ? colMap.debitCol : -1, credit: colMap.creditCol >= 0 ? colMap.creditCol : -1 })
    : { date: colMap.dateCol >= 0 ? colMap.dateCol : -1, desc: colMap.descCol >= 0 ? colMap.descCol : -1, amount: colMap.amtCol >= 0 ? colMap.amtCol : -1, debit: colMap.debitCol >= 0 ? colMap.debitCol : -1, credit: colMap.creditCol >= 0 ? colMap.creditCol : -1 };

  const [map, setMap] = useState(defaultMap);
  const [selectedBank, setSelectedBank] = useState(detectedBank || "");

  const applyBank = (bankKey) => {
    setSelectedBank(bankKey);
    if (!bankKey) return;
    const preset = buildMapFromPreset(bankKey, headers);
    if (preset) setMap(preset);
  };

  const preview = dataRows.slice(0, 3);

  const parseAmount = (v) => {
    if (typeof v === "number") return v;
    const s = String(v).replace(/[$,\s]/g, "");
    return parseFloat(s) || 0;
  };

  const handleImport = () => {
    if (map.desc === -1) { alert("Please select the Description column."); return; }
    if (map.date === -1) { alert("Please select the Date column."); return; }
    if (map.amount === -1 && map.debit === -1 && map.credit === -1) { alert("Please select at least an Amount column."); return; }

    const rows = dataRows.map((cols, i) => {
      const desc = cols[map.desc] || `Transaction ${i + 1}`;
      let amount = 0;
      if (map.amount >= 0) amount = parseAmount(cols[map.amount]);
      else {
        const d = map.debit >= 0 ? parseAmount(cols[map.debit]) : 0;
        const c = map.credit >= 0 ? parseAmount(cols[map.credit]) : 0;
        amount = c > 0 ? c : (d > 0 ? -d : 0);
      }
      return { id: `t_${Date.now()}_${i}`, date: cols[map.date] || new Date().toISOString().split("T")[0], description: desc.trim(), amount, categoryId: guessCategory(desc, categories, customKeywords), note: "" };
    }).filter(r => r.description && !isNaN(r.amount));

    setTransactions(prev => [...rows, ...prev]);
    notify(`✓ Imported ${rows.length} transactions!`);
    close();
  };

  const sel = (field, val) => setMap(m => ({ ...m, [field]: parseInt(val) }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Bank selector */}
      <div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Your bank <span style={{ color: T.muted, fontWeight: 400 }}>(optional — auto-fills columns)</span></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ key: "", label: "Other / Unknown" }, ...Object.entries(BANK_PRESETS).map(([k, v]) => ({ key: k, label: `${v.logo} ${v.name}` }))].map(b => (
            <button key={b.key} onClick={() => applyBank(b.key)}
              style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "DM Sans",
                background: selectedBank === b.key ? T.teal : "rgba(255,255,255,0.05)",
                color: selectedBank === b.key ? "#0a0a1a" : T.text,
                border: `1px solid ${selectedBank === b.key ? T.teal : T.border}` }}>
              {b.label}
            </button>
          ))}
        </div>
        {selectedBank && <div style={{ fontSize: 11, color: T.teal, marginTop: 6 }}>✓ Columns auto-filled for {BANK_PRESETS[selectedBank]?.name}. Verify below and adjust if needed.</div>}
      </div>

      <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, background: "rgba(78,205,196,0.07)", border: `1px solid rgba(78,205,196,0.2)`, borderRadius: 10, padding: 12 }}>
        {selectedBank ? `Columns pre-filled for ${BANK_PRESETS[selectedBank]?.name}. Review the preview below and click Import when ready.` : "Select your bank above for automatic column detection, or match each field manually."}
      </div>

      {/* Column selectors */}
      {[
        { label: "📅 Date column", field: "date", required: true },
        { label: "🏪 Description / Merchant column", field: "desc", required: true },
        { label: "💵 Amount column (single +/- column)", field: "amount", required: false },
        { label: "📤 Debit / Withdrawal column", field: "debit", required: false },
        { label: "📥 Credit / Deposit column", field: "credit", required: false },
      ].map(({ label, field, required }) => (
        <div key={field}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{label}{required && <span style={{ color: T.coral }}> *</span>}</div>
          <select className="input" value={map[field]} onChange={e => sel(field, e.target.value)}>
            <option value={-1}>— Not used —</option>
            {headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
          </select>
        </div>
      ))}

      {/* Preview */}
      {map.desc >= 0 && (
        <div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Preview (first 3 rows):</div>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}` }}>
            <table style={{ fontSize: 12 }}>
              <thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>
                    <td style={{ color: T.muted }}>{map.date >= 0 ? row[map.date] : "—"}</td>
                    <td style={{ fontWeight: 500 }}>{map.desc >= 0 ? row[map.desc] : "—"}</td>
                    <td>{map.amount >= 0 ? row[map.amount] : map.debit >= 0 ? `-${row[map.debit]}` : map.credit >= 0 ? row[map.credit] : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
        <button className="btn btn-ghost" onClick={close}>Cancel</button>
        <button className="btn btn-primary" onClick={handleImport}>Import Transactions</button>
      </div>
    </div>
  );
}

// ─── Column Mapper Component ─────────────────────────────────────────────────
// ─── Modal Component ──────────────────────────────────────────────────────────
function Modal({ modal, setModal, categories, setCategories, bills, setBills, schedule, setSchedule, transactions, setTransactions, customKeywords, setCustomKeywords, savingsGoals, setSavingsGoals, dbStatus, notify, guessCategory }) {
  const [form, setForm] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const close = () => setModal(null);

  const submit = () => {
    if (modal.type === "addCategory") {
      if (!form.name) return;
      setCategories(prev => [...prev, { id: `c_${Date.now()}`, name: form.name, color: form.color || CATEGORY_COLORS[prev.length % CATEGORY_COLORS.length], budget: parseFloat(form.budget) || 0, type: form.type || "expense" }]);
      notify("Category added!");
    } else if (modal.type === "editCategory") {
      setCategories(prev => prev.map(c => c.id === modal.cat.id ? {
        ...c,
        name:   form.name   ?? c.name,
        budget: form.budget !== undefined ? (parseFloat(form.budget) || 0) : c.budget,
        color:  form.color  ?? c.color,
      } : c));
      notify("Category updated!");
    } else if (modal.type === "addBill") {
      if (!form.name || !form.amount) return;
      setBills(prev => [...prev, { id: `b_${Date.now()}`, name: form.name, amount: parseFloat(form.amount), dueDay: parseInt(form.dueDay) || 1, isPaid: false, categoryId: form.categoryId || "other", isRecurring: true }]);
      notify("Bill added!");
    } else if (modal.type === "addSchedule") {
      if (!form.note || !form.amount || !form.date) return;
      setSchedule(prev => [...prev, { id: `s_${Date.now()}`, date: form.date, type: form.type || "transfer", amount: parseFloat(form.amount), note: form.note, from: form.from || "Checking", to: form.to || "Savings" }]);
      notify("Event scheduled!");
    } else if (modal.type === "addTransaction") {
      if (!form.description || !form.amount || !form.date) return;
      setTransactions(prev => [{ id: `t_${Date.now()}`, date: form.date, description: form.description, amount: parseFloat(form.amount), categoryId: form.categoryId || "other", note: form.note || "" }, ...prev]);
      notify("Transaction added!");
    } else if (modal.type === "addKeyword") {
      if (!form.keyword || !form.categoryId) return;
      const newKw = { id: `kw_${Date.now()}`, keyword: form.keyword.toLowerCase().trim(), categoryId: form.categoryId };
      setCustomKeywords(prev => [...prev, newKw]);
      if (dbStatus === "connected") sb.upsert("custom_keywords", newKw).catch(() => {});
      notify(`Keyword "${form.keyword}" added!`);
    } else if (modal.type === "addSavingsGoal") {
      if (!form.name || !form.targetAmount) return;
      const newGoal = { id: `sg_${Date.now()}`, name: form.name, targetAmount: parseFloat(form.targetAmount), color: form.color || "#4ADE80", emoji: form.emoji || "🎯", note: form.note || "", manualAmount: 0 };
      setSavingsGoals(prev => [...prev, newGoal]);
      notify(`Goal "${form.name}" created!`);
    } else if (modal.type === "editSavingsGoal") {
      setSavingsGoals(prev => prev.map(g => g.id === modal.goal.id ? { ...g,
        name: form.name ?? g.name,
        targetAmount: form.targetAmount ? parseFloat(form.targetAmount) : g.targetAmount,
        color: form.color ?? g.color,
        emoji: form.emoji ?? g.emoji,
        note: form.note ?? g.note,
      } : g));
      notify("Goal updated!");
    }
    close();
  };

  const titles = { addCategory: "Add Category", addBill: "Add Bill", addSchedule: "Schedule Event", addTransaction: "Add Transaction", addKeyword: "Add Keyword Rule", columnMapper: "Match Your CSV Columns", categoryDrilldown: "", addSavingsGoal: "Add Savings Goal", editSavingsGoal: "Edit Savings Goal", setupWizard: "", editCategory: "Edit Category" };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
      <div className={`modal ${(modal.type === "categoryDrilldown" || modal.type === "setupWizard") ? "wide" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700, flex: 1, marginRight: 12 }}>
            {modal.type === "categoryDrilldown" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: modal.cat?.color }} />
                {modal.cat?.name}
              </div>
            ) : modal.type === "setupWizard" ? null : titles[modal.type]}
          </div>
          <button style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }} onClick={close}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {modal.type === "addCategory" && <>
            <input className="input" placeholder="Category name (e.g. Groceries)" onChange={e => set("name", e.target.value)} />
            <select className="input" onChange={e => set("type", e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="savings">Savings</option>
            </select>
            <input className="input" type="number" placeholder="Monthly budget (optional)" onChange={e => set("budget", e.target.value)} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORY_COLORS.map(c => (
                <button key={c} onClick={() => set("color", c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: form.color === c ? `3px solid ${T.white}` : "3px solid transparent", cursor: "pointer" }} />
              ))}
            </div>
          </>}

          {modal.type === "editCategory" && <>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Category Name</div>
            <input className="input" defaultValue={modal.cat?.name} onChange={e => set("name", e.target.value)} />
            <div style={{ fontSize: 12, color: T.muted, marginTop: 8, marginBottom: 4 }}>Monthly Budget ($)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <span style={{ padding: "9px 10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: 14, color: T.muted }}>$</span>
              <input type="number" className="input" defaultValue={modal.cat?.budget || ""}
                placeholder="0 = no limit"
                onChange={e => set("budget", e.target.value)}
                style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
            </div>
            <div style={{ fontSize: 11, color: T.muted }}>Set to 0 for no monthly limit (e.g. Income, Savings)</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 8, marginBottom: 6 }}>Color</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[...CATEGORY_COLORS, "#6BCB77","#F87171","#60A5FA","#A3E635","#FDE68A","#94A3B8"].map(c => (
                <button key={c} onClick={() => set("color", c)}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: `3px solid ${(form.color ?? modal.cat?.color) === c ? T.white : "transparent"}`, cursor: "pointer" }} />
              ))}
            </div>
          </>}

          {modal.type === "addBill" && <>
            <input className="input" placeholder="Bill name (e.g. Netflix)" onChange={e => set("name", e.target.value)} />
            <input className="input" type="number" placeholder="Amount ($)" onChange={e => set("amount", e.target.value)} />
            <input className="input" type="number" min="1" max="31" placeholder="Due day of month (1-31)" onChange={e => set("dueDay", e.target.value)} />
            <select className="input" onChange={e => set("categoryId", e.target.value)}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </>}

          {modal.type === "addSchedule" && <>
            <input className="input" type="date" onChange={e => set("date", e.target.value)} />
            <input className="input" placeholder="Description (e.g. Transfer to savings)" onChange={e => set("note", e.target.value)} />
            <input className="input" type="number" placeholder="Amount ($)" onChange={e => set("amount", e.target.value)} />
            <select className="input" onChange={e => set("type", e.target.value)}>
              <option value="transfer">Transfer</option>
              <option value="bill">Bill Payment</option>
              <option value="other">Other</option>
            </select>
            <input className="input" placeholder="From account (e.g. Checking)" onChange={e => set("from", e.target.value)} />
            <input className="input" placeholder="To account / payee" onChange={e => set("to", e.target.value)} />
          </>}

          {modal.type === "addTransaction" && <>
            <input className="input" type="date" onChange={e => set("date", e.target.value)} />
            <input className="input" placeholder="Description" onChange={e => set("description", e.target.value)} />
            <input className="input" type="number" placeholder="Amount (negative for expense, e.g. -45.00)" onChange={e => set("amount", e.target.value)} />
            <select className="input" onChange={e => set("categoryId", e.target.value)}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input className="input" placeholder="Note (optional)" onChange={e => set("note", e.target.value)} />
          </>}

          {modal.type === "addKeyword" && <>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
              When a transaction description contains this keyword, it will automatically be assigned the chosen category. Your rules are checked before the built-in ones.
            </div>
            <input className="input" placeholder='Keyword (e.g. "Netflix", "H-E-B", "Shell")' onChange={e => set("keyword", e.target.value)} />
            <select className="input" onChange={e => set("categoryId", e.target.value)}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div style={{ fontSize: 12, color: T.muted }}>
              💡 Tip: Keywords are not case-sensitive. "starbucks" matches "STARBUCKS", "Starbucks", etc.
            </div>
          </>}

          {modal.type === "columnMapper" && <ColumnMapper modal={modal} categories={categories} customKeywords={customKeywords} setTransactions={setTransactions} notify={notify} close={close} guessCategory={guessCategory} />}
          {modal.type === "categoryDrilldown" && <CategoryDrilldown modal={modal} categories={categories} transactions={transactions} setTransactions={setTransactions} dbStatus={dbStatus} notify={notify} close={close} />}
{modal.type === "setupWizard" && <SetupWizard categories={categories} setCategories={setCategories} setCustomKeywords={setCustomKeywords} onComplete={() => { localStorage.setItem("smartbudget_setup_done","1"); setSetupComplete(true); close(); notify("Setup complete! 🎉"); }} />}

          {(modal.type === "addSavingsGoal" || modal.type === "editSavingsGoal") && <>
            <input className="input" placeholder="Goal name (e.g. Emergency Fund)" defaultValue={modal.goal?.name || ""}
              onChange={e => set("name", e.target.value)} />
            <input className="input" type="number" placeholder="Target amount ($)" defaultValue={modal.goal?.targetAmount || ""}
              onChange={e => set("targetAmount", e.target.value)} />
            <input className="input" placeholder='Note or deadline (e.g. "By Dec 2026")' defaultValue={modal.goal?.note || ""}
              onChange={e => set("note", e.target.value)} />
            <div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Pick an emoji</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["🎯","🏠","✈️","🚗","🎓","💍","🐣","🛡️","📱","💻","🏖️","🎁","🐾","💪","🌱"].map(em => (
                  <button key={em} onClick={() => set("emoji", em)}
                    style={{ fontSize: 20, background: (form.emoji ?? modal.goal?.emoji) === em ? "rgba(78,205,196,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${(form.emoji ?? modal.goal?.emoji) === em ? T.teal : T.border}`, borderRadius: 8, padding: "4px 8px", cursor: "pointer" }}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Pick a color</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["#4ADE80","#67E8F9","#FCD34D","#F472B6","#A78BFA","#FB923C","#60A5FA","#F87171"].map(c => (
                  <button key={c} onClick={() => set("color", c)}
                    style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: `3px solid ${(form.color ?? modal.goal?.color) === c ? T.white : "transparent"}`, cursor: "pointer" }} />
                ))}
              </div>
            </div>
          </>}
        </div>

        {modal.type !== "columnMapper" && modal.type !== "categoryDrilldown" && modal.type !== "setupWizard" && (
          <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
}
