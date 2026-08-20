const https = require("https");
const fs = require("fs");

const username = "@rahulyadavjq1w";
const url = `https://geeks-for-geeks-stats-api.vercel.app/?raw=y&userName=${username}`;

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    const stats = JSON.parse(data);

    const solved = stats.totalProblemsSolved ?? "N/A";
    const school = stats.school ?? "N/A";
    const basic = stats.basic ?? "N/A";
    const easy = stats.easy ?? "N/A";
    const medium = stats.medium ?? "N/A";
    const hard = stats.hard ?? "N/A";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150">
  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>
  <text x="20" y="30" fill="#2F8D46" font-size="20" font-family="monospace" font-weight="bold">GeeksforGeeks Stats</text>
  <text x="20" y="60" fill="#ffffff" font-size="16" font-family="monospace">Total Solved: ${solved}</text>
  <text x="20" y="85" fill="#58a6ff" font-size="14" font-family="monospace">Easy: ${easy}  Medium: ${medium}  Hard: ${hard}</text>
  <text x="20" y="110" fill="#8b949e" font-size="12" font-family="monospace">School: ${school}  Basic: ${basic}</text>
</svg>`;

    fs.mkdirSync("profile", { recursive: true });
    fs.writeFileSync("profile/gfg-stats.svg", svg);
    console.log("GFG stats SVG generated successfully.");
  });
}).on("error", (err) => {
  console.error("Failed to fetch GFG stats:", err.message);
  process.exit(1);
});
