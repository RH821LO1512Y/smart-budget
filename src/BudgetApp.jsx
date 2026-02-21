import { useState, useEffect, useCallback, useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, Area, AreaChart
} from "recharts";
import { Upload, DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar, Tag, CheckCircle, Circle, Plus, Trash2, X, ChevronLeft, ChevronRight, ArrowRight, AlertCircle } from "lucide-react";

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
  // ── Income & Savings ──
  { id: "income",        name: "Income",           color: T.green,   budget: 0,    type: "income"   },
  { id: "savings",       name: "Savings",           color: "#FCD34D", budget: 500,  type: "savings"  },
  { id: "marcus",        name: "Marcus",            color: "#FCD34D", budget: 0,    type: "savings"  },
  // ── Housing ──
  { id: "housing",       name: "Rent",              color: T.coral,   budget: 1500, type: "expense"  },
  // ── Food ──
  { id: "food",          name: "Food & Dining",     color: T.teal,    budget: 600,  type: "expense"  },
  { id: "grocery",       name: "Grocery",           color: "#34D399", budget: 400,  type: "expense"  },
  // ── Transport ──
  { id: "transport",     name: "Transportation",    color: T.yellow,  budget: 200,  type: "expense"  },
  { id: "gasoline",      name: "Gasoline",          color: "#FB923C", budget: 150,  type: "expense"  },
  // ── Utilities ──
  { id: "electricity",   name: "Electricity",       color: "#60A5FA", budget: 150,  type: "expense"  },
  { id: "wifi",          name: "Wi-Fi",             color: "#818CF8", budget: 80,   type: "expense"  },
  { id: "phone",         name: "Phone",             color: "#A78BFA", budget: 80,   type: "expense"  },
  // ── Health ──
  { id: "health_ins",    name: "Health Insurance",  color: T.green,   budget: 300,  type: "expense"  },
  { id: "dental",        name: "Dental",            color: "#6EE7B7", budget: 100,  type: "expense"  },
  { id: "medical",       name: "Medical Bills",     color: "#F87171", budget: 200,  type: "expense"  },
  // ── Credit Cards / Loans ──
  { id: "car_payment",   name: "Car Payment",       color: "#FBBF24", budget: 400,  type: "expense"  },
  { id: "apple_card",    name: "Apple Card",        color: "#E5E7EB", budget: 200,  type: "expense"  },
  { id: "citi_card",     name: "CITI Card",         color: "#3B82F6", budget: 200,  type: "expense"  },
  { id: "care_credit",   name: "Care Credit",       color: "#EC4899", budget: 100,  type: "expense"  },
  { id: "wells_fargo",   name: "Wells Fargo Card",  color: "#EF4444", budget: 200,  type: "expense"  },
  { id: "amoco_loan",    name: "AMOCO Loan",        color: "#F59E0B", budget: 0,    type: "expense"  },
  { id: "jgw",           name: "JG Wentworth",      color: "#D97706", budget: 0,    type: "expense"  },
  // ── Lifestyle ──
  { id: "fitness",       name: "Fitness",           color: "#4ADE80", budget: 60,   type: "expense"  },
  { id: "self_care",     name: "Self Care",         color: "#F472B6", budget: 100,  type: "expense"  },
  { id: "dogs",          name: "Dogs",              color: "#A3E635", budget: 100,  type: "expense"  },
  { id: "baby",          name: "Baby",              color: "#FDE68A", budget: 150,  type: "expense"  },
  { id: "contribution",  name: "Contribution",      color: "#C4B5FD", budget: 100,  type: "expense"  },
  { id: "subscriptions", name: "Subscriptions",     color: T.purple,  budget: 100,  type: "expense"  },
  { id: "entertainment", name: "Entertainment",     color: "#F472B6", budget: 100,  type: "expense"  },
  // ── Travel & Misc ──
  { id: "travel",        name: "Travel",            color: "#67E8F9", budget: 200,  type: "expense"  },
  { id: "shopping",      name: "Shopping / Misc",   color: "#FB923C", budget: 200,  type: "expense"  },
  { id: "work",          name: "Work",              color: "#94A3B8", budget: 0,    type: "expense"  },
  { id: "other",         name: "Other",             color: T.muted,   budget: 100,  type: "expense"  },
];

// ── Default keyword → category mappings (Rachel's custom list) ────────────────
const DEFAULT_KEYWORDS = [
  // Income
  { id: "kw_payroll",    keyword: "payroll",          categoryId: "income"       },
  { id: "kw_salary",     keyword: "salary",           categoryId: "income"       },
  { id: "kw_ddep",       keyword: "direct deposit",   categoryId: "income"       },
  { id: "kw_zelle",      keyword: "zelle",            categoryId: "income"       },
  // Savings
  { id: "kw_acorns",     keyword: "acorns",           categoryId: "savings"      },
  { id: "kw_marcus1",    keyword: "marcus",           categoryId: "marcus"       },
  { id: "kw_transfer",   keyword: "transfer",         categoryId: "savings"      },
  // Rent
  { id: "kw_rent",       keyword: "apts lewis",       categoryId: "housing"      },
  { id: "kw_rent2",      keyword: "rent",             categoryId: "housing"      },
  { id: "kw_mortgage",   keyword: "mortgage",         categoryId: "housing"      },
  // Food
  { id: "kw_chickfila",  keyword: "chick-fil-a",      categoryId: "food"         },
  { id: "kw_dq",         keyword: "dairy queen",      categoryId: "food"         },
  { id: "kw_doordash",   keyword: "doordash",         categoryId: "food"         },
  { id: "kw_mcdonalds",  keyword: "mcdonald",         categoryId: "food"         },
  { id: "kw_shipley",    keyword: "shipley",          categoryId: "food"         },
  { id: "kw_starbucks",  keyword: "starbucks",        categoryId: "food"         },
  { id: "kw_wingstop",   keyword: "wingstop",         categoryId: "food"         },
  { id: "kw_restaurant", keyword: "restaurant",       categoryId: "food"         },
  { id: "kw_ubereats",   keyword: "uber eats",        categoryId: "food"         },
  { id: "kw_grubhub",    keyword: "grubhub",          categoryId: "food"         },
  // Grocery
  { id: "kw_heb",        keyword: "h-e-b",            categoryId: "grocery"      },
  { id: "kw_kroger",     keyword: "kroger",           categoryId: "grocery"      },
  { id: "kw_walmart",    keyword: "wal-mart",         categoryId: "grocery"      },
  { id: "kw_walmart2",   keyword: "walmart",          categoryId: "grocery"      },
  { id: "kw_aldi",       keyword: "aldi",             categoryId: "grocery"      },
  // Gasoline
  { id: "kw_chevron",    keyword: "chevron",          categoryId: "gasoline"     },
  { id: "kw_fuel",       keyword: "fuel",             categoryId: "gasoline"     },
  { id: "kw_shell",      keyword: "shell",            categoryId: "gasoline"     },
  { id: "kw_exxon",      keyword: "exxon",            categoryId: "gasoline"     },
  // Gas utility
  { id: "kw_cpenergy",   keyword: "cpenergy",         categoryId: "electricity"  },
  { id: "kw_reliant",    keyword: "reliant",          categoryId: "electricity"  },
  // Wi-Fi
  { id: "kw_comcast",    keyword: "comcast",          categoryId: "wifi"         },
  // Phone
  { id: "kw_mobile",     keyword: "mobile",           categoryId: "phone"        },
  { id: "kw_tmobile",    keyword: "t-mobile",         categoryId: "phone"        },
  { id: "kw_att",        keyword: "at&t",             categoryId: "phone"        },
  // Health Insurance
  { id: "kw_aetna",      keyword: "aetna",            categoryId: "health_ins"   },
  { id: "kw_ambetter",   keyword: "ambetter",         categoryId: "health_ins"   },
  { id: "kw_guardian",   keyword: "guardian",         categoryId: "health_ins"   },
  // Dental
  { id: "kw_dental",     keyword: "dental",           categoryId: "dental"       },
  // Medical
  { id: "kw_napaa",      keyword: "napaanesth",       categoryId: "medical"      },
  { id: "kw_peds_uro",   keyword: "pediatric urology",categoryId: "medical"      },
  { id: "kw_serene",     keyword: "serene",           categoryId: "medical"      },
  { id: "kw_kelsey",     keyword: "kelsey",           categoryId: "medical"      },
  { id: "kw_memorial",   keyword: "memorial herma",   categoryId: "medical"      },
  // Credit Cards / Loans
  { id: "kw_wf_pay",     keyword: "wf payment",       categoryId: "car_payment"  },
  { id: "kw_apple",      keyword: "applecard",        categoryId: "apple_card"   },
  { id: "kw_citi",       keyword: "citi",             categoryId: "citi_card"    },
  { id: "kw_sync",       keyword: "synchrony bank",   categoryId: "care_credit"  },
  { id: "kw_wf_cred",    keyword: "wf credit",        categoryId: "wells_fargo"  },
  { id: "kw_amoco",      keyword: "amoco",            categoryId: "amoco_loan"   },
  { id: "kw_jgw",        keyword: "jgw",              categoryId: "jgw"          },
  { id: "kw_goldman",    keyword: "goldman",          categoryId: "marcus"       },
  // Fitness
  { id: "kw_fitness",    keyword: "fitness",          categoryId: "fitness"      },
  // Self Care
  { id: "kw_sally",      keyword: "sally",            categoryId: "self_care"    },
  // Dogs
  { id: "kw_rainwalk",   keyword: "rainwalk",         categoryId: "dogs"         },
  { id: "kw_petco",      keyword: "petco",            categoryId: "dogs"         },
  { id: "kw_petsmart",   keyword: "petsmart",         categoryId: "dogs"         },
  // Baby
  { id: "kw_carters",    keyword: "carters",          categoryId: "baby"         },
  // Contribution
  { id: "kw_tithe",      keyword: "tithe.ly",         categoryId: "contribution" },
  // Subscriptions
  { id: "kw_sub",        keyword: "subscription",     categoryId: "subscriptions"},
  { id: "kw_netflix",    keyword: "netflix",          categoryId: "subscriptions"},
  { id: "kw_spotify",    keyword: "spotify",          categoryId: "subscriptions"},
  { id: "kw_hulu",       keyword: "hulu",             categoryId: "subscriptions"},
  { id: "kw_disney",     keyword: "disney+",          categoryId: "subscriptions"},
  // Entertainment  
  { id: "kw_movie",      keyword: "movie",            categoryId: "entertainment"},
  { id: "kw_cinema",     keyword: "cinema",           categoryId: "entertainment"},
  // Shopping / Misc
  { id: "kw_amazon",     keyword: "amazon",           categoryId: "shopping"     },
  { id: "kw_homedepot",  keyword: "home depot",       categoryId: "shopping"     },
  { id: "kw_oportun",    keyword: "oportun",          categoryId: "shopping"     },
  { id: "kw_target",     keyword: "target",           categoryId: "shopping"     },
  // Transportation
  { id: "kw_hctra",      keyword: "hctra",            categoryId: "transport"    },
  { id: "kw_parking",    keyword: "parking",          categoryId: "transport"    },
  { id: "kw_uber",       keyword: "uber",             categoryId: "transport"    },
  { id: "kw_lyft",       keyword: "lyft",             categoryId: "transport"    },
  // Travel
  { id: "kw_iah",        keyword: "iah",              categoryId: "travel"       },
  { id: "kw_airport",    keyword: "airport",          categoryId: "travel"       },
  { id: "kw_hotel",      keyword: "hotel",            categoryId: "travel"       },
  // Work
  { id: "kw_mailmeteor", keyword: "mailmeteor",       categoryId: "work"         },
];

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
    .sidebar { position: fixed; left: -260px; top: 0; height: 100%; z-index: 200; transition: left 0.3s; }
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
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadDrag, setUploadDrag] = useState(false);
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
          if (txns.length) setTransactions(txns);
          if (cats.length) setCategories(cats);
          if (bls.length) setBills(bls);
          if (sched.length) setSchedule(sched);
          if (kwds.length) setCustomKeywords(kwds);
          setDbStatus("connected");
        } catch (e) {
          console.warn("Supabase load failed, falling back to local", e);
          const saved = localLoad();
          if (saved) {
            if (saved.transactions) setTransactions(saved.transactions);
            if (saved.categories) setCategories(saved.categories);
            if (saved.bills) setBills(saved.bills);
            if (saved.schedule) setSchedule(saved.schedule);
          }
          setDbStatus("local");
        }
      } else {
        const saved = localLoad();
        if (saved) {
          if (saved.transactions) setTransactions(saved.transactions);
          if (saved.categories) setCategories(saved.categories);
          if (saved.bills) setBills(saved.bills);
          if (saved.schedule) setSchedule(saved.schedule);
          if (saved.customKeywords) setCustomKeywords(saved.customKeywords);
        }
        setDbStatus("local");
      }
      setLoading(false);
    })();
  }, []);

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
    } else {
      localSave({ transactions, categories, bills, schedule, customKeywords });
    }
  }, [transactions, categories, bills, schedule, customKeywords, loading, dbStatus]);

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
          let descCol = h.findIndex(x => /\b(payee|merchant|description|narration|memo|particulars|reference|details|beneficiary)\b/.test(x));
          // Amount: single amount column
          let amtCol = h.findIndex(x => x === "amount" || x === "transaction amount" || x === "amt");
          // Separate debit/credit columns
          const debitCol = h.findIndex(x => x === "debit" || x === "debit amount" || x === "withdrawals");
          const creditCol = h.findIndex(x => x === "credit" || x === "credit amount" || x === "deposits");
          return { dateCol, descCol, amtCol, debitCol, creditCol, headers };
        };

        let parsedRows = [];
        let colMap = null;
        let rawHeaders = [];

        if (ext === "csv") {
          const allRows = parseCsvLines(e.target.result).filter(r => r.length > 1);
          rawHeaders = allRows[0];
          colMap = detectCols(rawHeaders);
          const dataRows = allRows.slice(1);

          // If description column not confidently found, open column mapper
          if (colMap.descCol === -1) {
            setModal({ type: "columnMapper", headers: rawHeaders, dataRows, colMap });
            return;
          }

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
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const netBalance = totalIncome - totalExpense;
  const savings = transactions.filter(t => { const c = categories.find(c => c.id === t.categoryId); return c?.type === "savings" && t.amount < 0; }).reduce((s, t) => s + Math.abs(t.amount), 0);

  const expenseByCategory = categories.filter(c => c.type === "expense").map(c => ({
    name: c.name,
    value: Math.abs(transactions.filter(t => t.categoryId === c.id && t.amount < 0).reduce((s, t) => s + t.amount, 0)),
    color: c.color,
  })).filter(c => c.value > 0);

  const monthlyData = (() => {
    const map = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = MONTHS[d.getMonth()] + " " + d.getFullYear().toString().slice(2);
      if (!map[key]) map[key] = { label, income: 0, expenses: 0 };
      if (t.amount > 0) map[key].income += t.amount;
      else map[key].expenses += Math.abs(t.amount);
    });
    return Object.values(map).slice(-6);
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
    { id: "dashboard", icon: TrendingUp, label: "Dashboard" },
    { id: "transactions", icon: DollarSign, label: "Transactions" },
    { id: "categories", icon: Tag, label: "Categories" },
    { id: "bills", icon: CreditCard, label: "Bills" },
    { id: "schedule", icon: Calendar, label: "Schedule" },
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
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} style={{ width: 220, background: T.card, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "24px 12px", gap: 4, flexShrink: 0 }}>
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
        <div style={{ marginTop: "auto", padding: "16px 8px 0", borderTop: `1px solid ${T.border}` }}>
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
      <main className="main-content" style={{ flex: 1, padding: "24px", overflowY: "auto", marginLeft: 0 }}>
        {/* Mobile header */}
        <div style={{ display: "none" }} className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: T.text, cursor: "pointer" }}>☰</button>
        </div>

        {/* ─ Dashboard ─ */}
        {tab === "dashboard" && (
          <div className="fade-in">
            <h1 style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Overview</h1>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 24 }}>
              {transactions.length === 0 ? "Upload your bank transactions to get started →" : `Analyzing ${transactions.length} transactions`}
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

                {/* Bar */}
                <div className="card">
                  <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 16 }}>Income vs Expenses</div>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={monthlyData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                        <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13 }} />
                        <Bar dataKey="income" fill={T.green} radius={[4, 4, 0, 0]} name="Income" />
                        <Bar dataKey="expenses" fill={T.coral} radius={[4, 4, 0, 0]} name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: 40 }}>Upload transactions to see monthly data</div>}
                </div>

                {/* Line */}
                <div className="card" style={{ gridColumn: "1 / -1" }}>
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
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 100).map(t => {
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
              {categories.map(cat => {
                const spent = Math.abs(transactions.filter(t => t.categoryId === cat.id && t.amount < 0).reduce((s, t) => s + t.amount, 0));
                const pct = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0;
                const over = cat.budget > 0 && spent > cat.budget;
                return (
                  <div key={cat.id} className="card" style={{ position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, boxShadow: `0 0 8px ${cat.color}60` }} />
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        <span className="tag" style={{ background: `rgba(255,255,255,0.06)`, color: T.muted, fontSize: 10 }}>{cat.type}</span>
                      </div>
                      <button className="btn btn-danger" style={{ padding: "3px 7px" }} onClick={() => { setCategories(prev => prev.filter(c => c.id !== cat.id)); if(dbStatus==="connected") sb.remove("categories", cat.id); }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: T.muted }}>Spent</span>
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
      {modal && <Modal modal={modal} setModal={setModal} categories={categories} setCategories={setCategories} bills={bills} setBills={setBills} schedule={schedule} setSchedule={setSchedule} transactions={transactions} setTransactions={setTransactions} customKeywords={customKeywords} setCustomKeywords={setCustomKeywords} dbStatus={dbStatus} notify={notify} guessCategory={guessCategory} />}
    </div>
  );
}

// ─── Column Mapper Component ─────────────────────────────────────────────────
function ColumnMapper({ modal, categories, customKeywords, setTransactions, notify, close, guessCategory }) {
  const { headers, dataRows, colMap } = modal;
  const [map, setMap] = useState({
    date: colMap.dateCol >= 0 ? colMap.dateCol : -1,
    desc: colMap.descCol >= 0 ? colMap.descCol : -1,
    amount: colMap.amtCol >= 0 ? colMap.amtCol : -1,
    debit: colMap.debitCol >= 0 ? colMap.debitCol : -1,
    credit: colMap.creditCol >= 0 ? colMap.creditCol : -1,
  });

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
      <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, background: "rgba(78,205,196,0.07)", border: `1px solid rgba(78,205,196,0.2)`, borderRadius: 10, padding: 12 }}>
        The app couldn't automatically detect which column contains the merchant/description. Please match each field to the correct column from your file.
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
function Modal({ modal, setModal, categories, setCategories, bills, setBills, schedule, setSchedule, transactions, setTransactions, customKeywords, setCustomKeywords, dbStatus, notify, guessCategory }) {
  const [form, setForm] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const close = () => setModal(null);

  const submit = () => {
    if (modal.type === "addCategory") {
      if (!form.name) return;
      setCategories(prev => [...prev, { id: `c_${Date.now()}`, name: form.name, color: form.color || CATEGORY_COLORS[prev.length % CATEGORY_COLORS.length], budget: parseFloat(form.budget) || 0, type: form.type || "expense" }]);
      notify("Category added!");
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
    }
    close();
  };

  const titles = { addCategory: "Add Category", addBill: "Add Bill", addSchedule: "Schedule Event", addTransaction: "Add Transaction", addKeyword: "Add Keyword Rule", columnMapper: "Match Your CSV Columns" };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700 }}>{titles[modal.type]}</div>
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
        </div>

        {modal.type !== "columnMapper" && (
          <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
}
