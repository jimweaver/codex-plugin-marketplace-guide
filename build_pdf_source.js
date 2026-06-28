const fs = require("fs");
const path = require("path");

const root = __dirname;
const indexPath = path.join(root, "index.html");
const outPath = path.join(root, "codex-plugin-marketplace-guide-pdf-source.html");

const html = fs.readFileSync(indexPath, "utf8");
const dataMatch = html.match(/const PLUGINS = (.*?);\n    const CATEGORY_COUNTS/s);
const categoriesMatch = html.match(/const CATEGORY_COUNTS = (.*?);\n    const categoryOrder/s);

if (!dataMatch || !categoriesMatch) {
  throw new Error("Could not find embedded plugin data in index.html");
}

const plugins = JSON.parse(dataMatch[1]);
const categoryCounts = JSON.parse(categoriesMatch[1]);
const categoryOrder = [
  "开发者工具",
  "生产力",
  "金融与财务",
  "业务与运营",
  "数据与分析",
  "沟通协作",
  "教育与研究",
  "创意与设计",
  "安全",
  "出行",
  "其他",
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const sortedCategories = categoryOrder
  .filter((category) => categoryCounts[category])
  .concat(Object.keys(categoryCounts).filter((category) => !categoryOrder.includes(category)));

const categoryBlocks = sortedCategories
  .map((category) => {
    const items = plugins.filter((plugin) => plugin.categoryZh === category);
    return `
      <section>
        <h2>${escapeHtml(category)} <span>${items.length} 个</span></h2>
        ${items
          .map(
            (plugin) => `
          <article>
            <h3>${escapeHtml(plugin.displayName)} <small>${escapeHtml(plugin.name)}</small></h3>
            <p>${escapeHtml(plugin.summaryZh)}</p>
            <dl>
              <dt>典型任务</dt><dd>${escapeHtml(plugin.taskZh)}</dd>
              <dt>开发者</dt><dd>${escapeHtml(plugin.developer || "未注明")}</dd>
              <dt>授权</dt><dd>${escapeHtml(plugin.auth)}</dd>
              <dt>能力</dt><dd>${escapeHtml(plugin.capabilities.length ? plugin.capabilities.join(", ") : "未注明")}</dd>
              <dt>技能</dt><dd>${plugin.skills ? `${plugin.skills} 个技能文件` : "连接器型插件"}</dd>
              <dt>官网</dt><dd>${escapeHtml(plugin.websiteURL || "未提供")}</dd>
            </dl>
          </article>`
          )
          .join("")}
      </section>`;
  })
  .join("");

const doc = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>Codex Marketplace 180 个插件中文指南 PDF</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 13mm;
    }
    body {
      margin: 0;
      color: #17201f;
      font-family: "Noto Sans CJK SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
      font-size: 9.8pt;
      line-height: 1.52;
    }
    h1 {
      margin: 0 0 8mm;
      font-size: 25pt;
      line-height: 1.08;
      letter-spacing: 0;
    }
    .lead {
      margin: 0 0 8mm;
      color: #40514d;
      font-size: 11pt;
    }
    .stats {
      display: table;
      width: 100%;
      margin: 0 0 8mm;
      border-collapse: collapse;
    }
    .stat {
      display: table-cell;
      width: 33.33%;
      padding: 8px 10px;
      border: 1px solid #dce4e1;
    }
    .stat strong {
      display: block;
      color: #08756f;
      font-size: 18pt;
      line-height: 1.1;
    }
    .stat span {
      color: #60706d;
      font-size: 9pt;
    }
    h2 {
      margin: 8mm 0 3mm;
      padding-bottom: 2mm;
      border-bottom: 1px solid #dce4e1;
      font-size: 16pt;
      page-break-after: avoid;
    }
    h2 span {
      color: #60706d;
      font-size: 10pt;
      font-weight: 400;
    }
    article {
      margin: 0 0 4mm;
      padding: 3.5mm;
      border: 1px solid #dce4e1;
      border-radius: 4px;
      page-break-inside: avoid;
    }
    h3 {
      margin: 0 0 1.5mm;
      font-size: 12.5pt;
      line-height: 1.25;
    }
    h3 small {
      color: #60706d;
      font-size: 8.5pt;
      font-weight: 400;
    }
    p {
      margin: 0 0 2mm;
    }
    dl {
      display: grid;
      grid-template-columns: 17mm 1fr;
      gap: 1mm 3mm;
      margin: 0;
      font-size: 8.8pt;
    }
    dt {
      color: #17201f;
      font-weight: 700;
    }
    dd {
      margin: 0;
      color: #40514d;
      overflow-wrap: anywhere;
    }
    .source {
      margin-top: 8mm;
      color: #60706d;
      font-size: 8.5pt;
    }
  </style>
</head>
<body>
  <h1>Codex Marketplace 180 个插件中文指南</h1>
  <p class="lead">这份 PDF 基于本仓库的静态网站数据生成，帮助中文读者快速了解 Codex Marketplace 中 180 个可用插件的用途、典型任务、授权方式和官网入口。</p>
  <div class="stats">
    <div class="stat"><strong>${plugins.length}</strong><span>可用插件</span></div>
    <div class="stat"><strong>${Object.keys(categoryCounts).length}</strong><span>类别</span></div>
    <div class="stat"><strong>${plugins.reduce((sum, plugin) => sum + plugin.skills, 0)}</strong><span>本地技能文件</span></div>
  </div>
  ${categoryBlocks}
  <p class="source">来源：本地同步的 Codex Marketplace 数据。线上 Marketplace 可能新增、下架或更新插件。</p>
</body>
</html>`;

fs.writeFileSync(outPath, doc);
console.log(`Wrote ${outPath}`);
