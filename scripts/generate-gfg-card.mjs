import fs from "fs";

const username = process.argv[2] || "rahulyadavjq1w";

const API_URL =
  `https://gfg-stats.tashif.codes/${encodeURIComponent(username)}/stats`;

const PROFILE_URL =
  `https://gfg-stats.tashif.codes/${encodeURIComponent(username)}/profile`;

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "GitHub-GFG-Stats-Card"
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response: ${text.slice(0, 300)}`);
  }
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function main() {
  console.log(`Fetching GFG stats for: ${username}`);

  const [statsResponse, profileResponse] = await Promise.all([
    fetchJson(API_URL),
    fetchJson(PROFILE_URL)
  ]);

  if (statsResponse.status !== "success") {
    throw new Error("GFG stats API returned an error.");
  }

  if (profileResponse.status !== "success") {
    throw new Error("GFG profile API returned an error.");
  }

  const stats = statsResponse.data || {};
  const profile = profileResponse.data || {};

  const total = num(stats.totalSolved);

  const easy = num(stats.byDifficulty?.easy);
  const medium = num(stats.byDifficulty?.medium);
  const hard = num(stats.byDifficulty?.hard);

  const displayName =
    profile.displayName || username;

  console.log("GFG Profile:", displayName);
  console.log("Total Solved:", total);
  console.log("Easy:", easy);
  console.log("Medium:", medium);
  console.log("Hard:", hard);

  /*
   * Ring math
   */
  const CIRC = 515.2;
  const sum = Math.max(total, 1);

  const easyLen = (easy / sum) * CIRC;
  const mediumLen = (medium / sum) * CIRC;
  const hardLen = (hard / sum) * CIRC;

  const initial = displayName
    .charAt(0)
    .toUpperCase();

  const updated = new Date()
    .toISOString()
    .slice(0, 10);

  const svg = `
<svg
  width="620"
  height="260"
  viewBox="0 0 620 260"
  xmlns="http://www.w3.org/2000/svg"
>

  <rect
    width="620"
    height="260"
    rx="14"
    fill="#0d1117"
    stroke="#21262d"
    stroke-width="1"
  />

  <!-- Profile Header -->
  <g transform="translate(24,24)">

    <circle
      cx="16"
      cy="16"
      r="16"
      fill="#2F8D46"
    />

    <text
      x="16"
      y="21"
      text-anchor="middle"
      font-family="Segoe UI, sans-serif"
      font-size="14"
      font-weight="bold"
      fill="#ffffff"
    >
      ${initial}
    </text>

    <text
      x="42"
      y="12"
      font-family="Segoe UI, sans-serif"
      font-size="18"
      font-weight="700"
      fill="#e6edf3"
    >
      ${escapeXml(displayName)}
    </text>

    <text
      x="42"
      y="30"
      font-family="Segoe UI, sans-serif"
      font-size="12"
      fill="#8b949e"
    >
      GeeksforGeeks Profile
    </text>

  </g>

  <line
    x1="24"
    y1="66"
    x2="596"
    y2="66"
    stroke="#21262d"
    stroke-width="1"
  />

  <!-- Progress Ring -->
  <g transform="translate(140,175)">

    <circle
      r="82"
      fill="none"
      stroke="#21262d"
      stroke-width="18"
    />

    <!-- Easy -->
    <circle
      r="82"
      fill="none"
      stroke="#4caf50"
      stroke-width="18"
      stroke-dasharray="${easyLen} ${CIRC}"
      transform="rotate(-90)"
    />

    <!-- Medium -->
    <circle
      r="82"
      fill="none"
      stroke="#f5a623"
      stroke-width="18"
      stroke-dasharray="${mediumLen} ${CIRC}"
      stroke-dashoffset="${-easyLen}"
      transform="rotate(-90)"
    />

    <!-- Hard -->
    <circle
      r="82"
      fill="none"
      stroke="#ef4743"
      stroke-width="18"
      stroke-dasharray="${hardLen} ${CIRC}"
      stroke-dashoffset="${-(easyLen + mediumLen)}"
      transform="rotate(-90)"
    />

    <text
      x="0"
      y="-6"
      text-anchor="middle"
      font-family="Segoe UI, sans-serif"
      font-size="38"
      font-weight="800"
      fill="#ffffff"
    >
      ${total}
    </text>

    <text
      x="0"
      y="20"
      text-anchor="middle"
      font-family="Segoe UI, sans-serif"
      font-size="13"
      fill="#8b949e"
    >
      Problems Solved
    </text>

  </g>

  <!-- Statistics -->
  <g
    transform="translate(320,100)"
    font-family="Segoe UI, sans-serif"
    font-size="15"
    fill="#c9d1d9"
  >

    <rect
      x="0"
      y="0"
      width="10"
      height="10"
      rx="2"
      fill="#4caf50"
    />

    <text x="18" y="10">
      Easy (${easy})
    </text>


    <rect
      x="0"
      y="40"
      width="10"
      height="10"
      rx="2"
      fill="#f5a623"
    />

    <text x="18" y="50">
      Medium (${medium})
    </text>


    <rect
      x="0"
      y="80"
      width="10"
      height="10"
      rx="2"
      fill="#ef4743"
    />

    <text x="18" y="90">
      Hard (${hard})
    </text>


    <rect
      x="0"
      y="120"
      width="10"
      height="10"
      rx="2"
      fill="#2F8D46"
    />

    <text x="18" y="130">
      Total (${total})
    </text>

  </g>

  <text
    x="596"
    y="248"
    text-anchor="end"
    font-family="Segoe UI, sans-serif"
    font-size="10"
    fill="#484f58"
  >
    Updated ${updated}
  </text>

</svg>
`;

  fs.mkdirSync("profile", { recursive: true });

  fs.writeFileSync(
    "profile/gfg-stats.svg",
    svg.trim()
  );

  console.log("✅ profile/gfg-stats.svg generated successfully.");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

main().catch((error) => {
  console.error("❌ GFG stats generation failed:");
  console.error(error.message);
  process.exit(1);
});
