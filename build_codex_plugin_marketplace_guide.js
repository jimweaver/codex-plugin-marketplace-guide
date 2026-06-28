const fs = require("fs");
const path = require("path");

const workspace = __dirname;
const repoRoot = "/home/jim/.codex/.tmp/plugins";
const installedRoot = "/home/jim/.codex/plugins/cache/openai-curated-remote";
const outFile = path.join(workspace, "index.html");

const categoryZh = {
  "Business & Operations": "业务与运营",
  "Finance": "金融与财务",
  "Productivity": "生产力",
  "Data & Analytics": "数据与分析",
  "Developer Tools": "开发者工具",
  "Creativity": "创意与设计",
  "Education & Research": "教育与研究",
  "Communication": "沟通协作",
  "Security": "安全",
  "Travel": "出行",
  "Other": "其他",
};

const categoryTone = {
  "Business & Operations": "连接客户、市场、销售、运营或企业工作流，帮助 Codex 把业务上下文整理成可执行的下一步。",
  "Finance": "面向金融、市场、财务、支付、投资或商业情报场景，适合做查询、核对、摘要和决策支持。",
  "Productivity": "处理文档、任务、知识库、日程、表单、文件和团队协作内容，让日常工作流更容易落地。",
  "Data & Analytics": "用于数据查询、产品分析、BI、实验、市场情报和报告解读，让分析结果更容易被复用。",
  "Developer Tools": "支持开发、部署、调试、代码审查、云服务、数据库、自动化和工程平台相关工作。",
  "Creativity": "面向设计、影像、媒体、生成式内容和创意生产，适合把想法转成可评审资产。",
  "Education & Research": "用于论文、政策、科研、文献、生命科学或专业资料检索和总结。",
  "Communication": "连接邮件、会议记录、聊天或通话工具，帮助总结沟通、提取行动项和起草回复。",
  "Security": "面向安全审查、漏洞分析、代码风险和防护建议。",
  "Travel": "处理旅行、天气、住宿、交通或本地信息相关查询。",
  "Other": "提供垂直场景能力，适合在对应业务或个人工作流中按需连接。",
};

const categoryTasks = {
  "Business & Operations": "整理客户资料、生成跟进计划、分析账号信号、准备销售或运营材料。",
  "Finance": "查询市场数据、总结公司信息、核对财务指标、支持投资或支付相关判断。",
  "Productivity": "查找文件、总结页面、管理任务、准备会议、处理表单或协作内容。",
  "Data & Analytics": "读取数据源、解释指标变化、生成分析摘要、辅助制作报告或仪表盘。",
  "Developer Tools": "检查代码库、排查部署、配置云服务、运行开发工作流、生成工程建议。",
  "Creativity": "生成设计方向、处理素材、制作视频/图像/演示内容或创意 brief。",
  "Education & Research": "检索文献、总结研究材料、比较证据、整理专业参考。",
  "Communication": "总结线程或会议、提取待办、草拟回复、同步团队信息。",
  "Security": "审查风险、解释安全发现、规划修复步骤。",
  "Travel": "查询天气、行程、地点或旅行相关建议。",
  "Other": "按插件对应的垂直领域完成查询、摘要或自动化。",
};

const knownUse = {
  "build-web-apps": "用于从零构建前端网站、应用、仪表盘和交互体验，并处理 React、Next.js、shadcn/ui、Stripe、Supabase 等常见实现问题。",
  "build-macos-apps": "用于 macOS SwiftUI/AppKit 应用的构建、调试、测试、签名、公证、打包和窗口体验调整。",
  "build-ios-apps": "用于 iOS 应用开发工作流，覆盖 Xcode、Swift、模拟器、构建、测试和移动端实现问题。",
  "build-web-data-visualization": "用于 Web 数据可视化工程，覆盖图表选择、D3、Canvas、Three.js、地图、仪表盘和可视化 QA。",
  "openai-developers": "用于 OpenAI 平台开发、API Key 安全配置、Agents SDK、ChatGPT Apps 和 API 报错排查。",
  "github": "用于 GitHub 仓库、Issue、PR、代码评审、CI、提交和发布流程。",
  "vercel": "用于 Vercel 生态里的 Next.js、部署、函数、存储、观测、环境变量、AI SDK 和平台排障。",
  "supabase": "用于 Supabase 项目管理、Postgres、SQL、迁移、认证、存储和数据库最佳实践。",
  "figma": "用于读取 Figma 设计、生成或更新设计文件、设计系统、Code Connect，以及把设计转成代码。",
  "hugging-face": "用于 Hugging Face Hub、模型、数据集、论文、Gradio、Jobs、训练和实验追踪。",
  "gmail": "用于 Gmail 搜索、线程摘要、收件箱分桶、行动项提取和回复/转发草稿。",
  "google-calendar": "用于 Google Calendar 日程查询、可用时间比较、会议安排、每日 brief 和会议准备。",
  "google-drive": "用于 Google Drive、Docs、Sheets、Slides 的搜索、读取、创建、编辑、导出和评论。",
  "notion": "用于 Notion 文档、知识库、规格拆解、会议材料、研究总结和决策捕获。",
  "slack": "用于 Slack 频道和线程摘要、消息草稿、团队更新和协作信息整理。",
  "teams": "用于 Microsoft Teams 里的消息、会议和团队协作内容摘要与整理。",
  "outlook-email": "用于 Outlook 邮件搜索、线程摘要、回复草稿和邮件行动项整理。",
  "outlook-calendar": "用于 Outlook Calendar 日程查询、冲突检查、会议准备和时间安排。",
  "salesforce": "用于 Salesforce CRM 记录、机会、客户和销售流程；如果可见，适合销售上下文工作。",
  "hubspot": "用于 HubSpot CRM、营销、客户沟通和交易上下文整理。",
  "linear": "用于 Linear issue、项目、路线图、工程任务和产品开发跟踪。",
  "asana": "用于 Asana 任务、项目计划、负责人、截止日期和团队执行状态。",
  "jira": "用于 Jira issue 和敏捷开发跟踪；如果由 Atlassian 插件暴露，适合项目管理。",
  "atlassian-rovo": "用于 Atlassian/Rovo 工作流，把 Jira、Confluence 等 Atlassian 上下文带进 Codex。",
  "airtable": "用于 Airtable 表格、数据库式协作、记录查询、轻量 CRM 和运营表。",
  "clickup": "用于 ClickUp 任务、项目、文档和团队执行进度整理。",
  "monday-com": "用于 Monday.com 工作管理、项目板、状态跟踪和运营流程。",
  "zoom": "用于 Zoom 会议、录制或通话上下文，适合会议摘要和后续行动。",
  "granola": "用于 Granola 会议笔记、客户通话记录和会议后续整理。",
  "fireflies": "用于 Fireflies 会议记录、通话转写、摘要和待办提取。",
  "otter-ai": "用于 Otter.ai 转写、会议摘要、讲话内容和行动项。",
  "read-ai": "用于 Read AI 会议洞察、摘要、行动项和团队沟通复盘。",
  "circleback": "用于 Circleback 会议笔记和会后跟进整理。",
  "intercom": "用于 Intercom 客服、客户对话、支持线索和产品反馈整理。",
  "zendesk": "用于客服工单和支持知识库；如果可见，适合客户支持工作流。",
  "pipedrive": "用于 Pipedrive CRM、交易管道、销售机会和跟进计划。",
  "close": "用于 Close CRM、销售通话、邮件、线索和机会推进。",
  "apollo": "用于 Apollo 销售线索、联系人、账号研究和外联准备。",
  "zoominfo": "用于 ZoomInfo 公司和联系人情报、客户画像和销售优先级。",
  "clay": "用于 Clay 数据丰富、线索构建、账号研究和销售自动化。",
  "stripe": "用于 Stripe 支付、账单、订阅、Connect、发票和交易相关工作。",
  "shopify": "用于 Shopify 商店、商品、订单、客户和电商运营。",
  "quickbooks": "用于 QuickBooks 会计、发票、账单、收入和财务运营。",
  "neon-postgres": "用于 Neon Postgres 数据库、分支、连接、查询和云数据库工作流。",
  "cloudflare": "用于 Cloudflare Workers、Pages、KV、D1、R2、AI、网络和安全平台。",
  "netlify": "用于 Netlify 站点部署、构建、函数和前端托管流程。",
  "render": "用于 Render 服务部署、后端托管、日志和运行状态排查。",
  "digitalocean": "用于 DigitalOcean 云资源、应用、数据库和部署管理。",
  "replit": "用于 Replit 项目、在线开发环境、部署和协作编码。",
  "expo": "用于 Expo/React Native 应用构建、开发、测试和发布工作流。",
  "cloudinary": "用于 Cloudinary 图片、视频、媒体资产处理、优化和交付。",
  "sendgrid": "用于 SendGrid 邮件发送、模板、投递和事务邮件配置。",
  "twilio-developer-kit": "用于 Twilio 通信 API、短信、语音和开发集成。",
  "circleci": "用于 CircleCI CI/CD 配置、构建状态、失败日志和流水线排障。",
  "sentry": "用于 Sentry 错误监控、性能问题、issue 分析和修复建议。",
  "datadog": "用于 Datadog 日志、指标、APM、监控和生产问题排查。",
  "statsig": "用于 Statsig 实验、feature flags、指标和产品决策。",
  "posthog": "用于 PostHog 产品分析、事件、漏斗、实验和用户行为洞察。",
  "mixpanel": "用于 Mixpanel 产品分析、漏斗、留存、事件和用户路径。",
  "amplitude": "用于 Amplitude 产品分析、行为数据、分群和增长洞察。",
  "hex": "用于 Hex notebook、分析工作流、SQL/Python 报告和数据协作。",
  "deepnote": "用于 Deepnote notebook、数据分析、协作和可复现实验。",
  "motherduck": "用于 MotherDuck/DuckDB 云数据分析、查询和轻量数据仓库工作流。",
  "thoughtspot": "用于 ThoughtSpot BI、自助分析、指标查询和业务报告解读。",
  "omni-analytics": "用于 Omni Analytics BI、数据建模、仪表盘和指标分析。",
  "snowflake": "用于 Snowflake 数据仓库查询和数据平台工作流；如果可见，适合分析任务。",
  "canva": "用于 Canva 设计、演示、营销素材和创意资产协作。",
  "heygen": "用于 HeyGen 视频、头像、生成式视频和本地化创意制作。",
  "remotion": "用于 Remotion 代码化视频制作、动态图形和视频自动化。",
  "shutterstock": "用于 Shutterstock 素材搜索、图片/视频资产和创意参考。",
  "picsart": "用于 Picsart 图片编辑、设计素材和视觉内容制作。",
  "fal": "用于 Fal 生成式媒体、模型推理、图片/视频生成和创意自动化。",
  "biorender": "用于 BioRender 科学图示、生命科学插图和研究材料可视化。",
  "zotero": "用于 Zotero 文献库、引用、论文资料和研究笔记整理。",
  "scite": "用于 Scite 文献引用语境、研究证据和论文可信度判断。",
  "readwise": "用于 Readwise 阅读摘录、笔记、知识回顾和研究资料整理。",
  "dow-jones-factiva": "用于 Dow Jones Factiva 新闻、公司情报、媒体资料和研究检索。",
  "pitchbook": "用于 PitchBook 公司、投资、融资、市场和私募数据研究。",
  "cb-insights": "用于 CB Insights 市场、公司、融资、行业趋势和竞争情报。",
  "morningstar": "用于 Morningstar 投资研究、基金、股票和金融数据分析。",
  "factset": "用于 FactSet 金融数据、公司资料、市场研究和投资分析。",
  "lseg": "用于 LSEG 金融市场数据、公司信息和资本市场研究。",
  "s-p": "用于 S&P Global 信用、市场、公司和行业数据研究。",
  "moody-s": "用于 Moody's 信用、风险、公司和金融研究资料。",
  "binance": "用于 Binance 加密资产、行情、账户或交易相关信息。",
  "alpaca": "用于 Alpaca 交易、市场数据、投资组合和量化交易工作流。",
  "brex": "用于 Brex 公司卡、费用、财务运营和企业支出管理。",
  "razorpay": "用于 Razorpay 支付、订单、结算和印度支付业务。",
  "docusign": "用于 Docusign 合同、签署、协议流程和文件状态。",
  "box": "用于 Box 文件、文件夹、共享、企业内容和文档协作。",
  "sharepoint": "用于 SharePoint 文件、站点、企业文档和团队知识库。",
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function walk(dir, predicate, result = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return result;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, result);
    else if (predicate(full)) result.push(full);
  }
  return result;
}

function countSkills(pluginDir) {
  return walk(pluginDir, (file) => path.basename(file) === "SKILL.md").length;
}

function cleanText(value) {
  return String(value || "")
    .replace(/\r?\n/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[`*_~>|]/g, "")
    .trim();
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*?)\s*$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2] || "";
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return meta;
}

function extractSkillExcerpt(raw, frontMatterDescription) {
  if (frontMatterDescription) return cleanText(frontMatterDescription).slice(0, 240);
  const body = raw.replace(/^---[\s\S]*?---\r?\n?/, "");
  const paragraphs = body
    .split(/\r?\n\r?\n+/)
    .map(cleanText)
    .filter(Boolean);
  for (const paragraph of paragraphs) {
    if (/^#/.test(paragraph) || /^`{3}/.test(paragraph) || paragraph.startsWith("|")) continue;
    return paragraph.slice(0, 240);
  }
  return "";
}

function hasChineseText(value) {
  return /[\u4e00-\u9fff]/.test(String(value || ""));
}

function asChineseDescription({
  description,
  pluginDisplayName,
  pluginCategory,
  summaryZh,
  taskZh,
  skillName,
}) {
  const normalized = String(description || "").trim();
  if (normalized && hasChineseText(normalized) && normalized !== "-") {
    return normalized;
  }
  const categoryText = pluginCategory ? `${pluginCategory}场景` : "相关场景";
  const context = summaryZh || taskZh || "适合在该插件场景中配合上下文使用。";
  return `这是“${pluginDisplayName}”下的技能「${skillName}」，用于${categoryText}。${context}`;
}

function parseSkillItems(skillFiles, pluginMetaByName) {
  const items = [];
  for (const file of skillFiles) {
    const relParts = path.relative(repoRoot, file).split(path.sep);
    const skillIndex = relParts.indexOf("skills");
    if (skillIndex < 1 || !relParts[skillIndex + 1]) continue;

    const pluginName = skillIndex >= 2 ? relParts[skillIndex - 1] : relParts[skillIndex + 1];
    const skillSlug = relParts[skillIndex + 1];
    if (!pluginName || !skillSlug) continue;

    let raw = "";
    try {
      raw = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    const frontMatter = parseFrontMatter(raw);
    const description = extractSkillExcerpt(raw, frontMatter.description);
    const meta = pluginMetaByName.get(pluginName) || {};
    const normalizedDescription = asChineseDescription({
      description,
      pluginDisplayName: meta.displayName || titleFromSlug(pluginName),
      pluginCategory: meta.categoryZh || "",
      summaryZh: meta.summaryZh || "",
      taskZh: meta.taskZh || "",
      skillName: frontMatter.name ? frontMatter.name : titleFromSlug(skillSlug),
    });

    items.push({
      pluginName,
      pluginDisplayName: meta.displayName || titleFromSlug(pluginName),
      pluginCategory: meta.categoryZh || "",
      pluginInstalled: Boolean(meta.installed),
      skillSlug,
      skillName: frontMatter.name ? frontMatter.name : titleFromSlug(skillSlug),
      description: normalizedDescription || "暂无简介，可在原始 SKILL.md 中查看完整内容。",
      sourcePath: path.relative(repoRoot, file).replace(/\\/g, "/"),
    });
  }
  return items;
}

function readReadmeSummary(pluginDir) {
  const file = path.join(pluginDir, "README.md");
  if (!fs.existsSync(file)) return "";
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const body = [];
  for (const line of lines) {
    const clean = line.trim();
    if (!clean || clean.startsWith("#") || clean.startsWith("|") || clean.startsWith("- ")) continue;
    body.push(clean.replace(/`/g, ""));
    if (body.join(" ").length > 220) break;
  }
  return body.join(" ").slice(0, 260);
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (part === "ai") return "AI";
      if (part === "io") return "IO";
      if (part === "api") return "API";
      if (part === "crm") return "CRM";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function chineseSummary(plugin) {
  if (knownUse[plugin.name]) return knownUse[plugin.name];
  const tone = categoryTone[plugin.category] || categoryTone.Other;
  const writePart = plugin.capabilities.includes("Write")
    ? "它通常可以读取上下文、生成草稿，并在你确认后执行写入或更新。"
    : "它主要适合查询、汇总、分析或准备材料，是否能写回系统取决于连接器能力。";
  return `在 Codex 中连接 ${plugin.displayName}。${tone}${writePart}`;
}

function typicalTask(plugin) {
  if (plugin.defaultPrompt.length) {
    const prompt = plugin.defaultPrompt[0].replace(/\s+/g, " ").trim();
    return `可以从“${prompt}”这类请求开始，然后让 Codex 读取上下文、整理结果或准备下一步。`;
  }
  return categoryTasks[plugin.category] || categoryTasks.Other;
}

function authLabel(policy) {
  if (!policy) return "未注明";
  if (policy.authentication === "ON_INSTALL") return "安装时授权";
  if (policy.authentication === "ON_USE") return "使用时授权";
  if (policy.authentication === "NONE") return "无需授权";
  return policy.authentication || "未注明";
}

const marketplace = readJson(path.join(repoRoot, ".agents/plugins/marketplace.json"))?.plugins || [];
const apiMarketplace = readJson(path.join(repoRoot, ".agents/plugins/api_marketplace.json"))?.plugins || [];
const policies = new Map();
for (const item of [...marketplace, ...apiMarketplace]) policies.set(item.name, item);

const pluginNames = fs
  .readdirSync(path.join(repoRoot, "plugins"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const installedNames = new Set(
  fs.existsSync(installedRoot)
    ? fs.readdirSync(installedRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    : []
);

const plugins = pluginNames.map((name) => {
  const pluginDir = path.join(repoRoot, "plugins", name);
  const manifest = readJson(path.join(pluginDir, ".codex-plugin/plugin.json")) || {};
  const iface = manifest.interface || {};
  const policy = policies.get(name)?.policy || {};
  const category = iface.category || policies.get(name)?.category || "Other";
  const item = {
    name,
    displayName: iface.displayName || manifest.name || titleFromSlug(name),
    version: manifest.version || "",
    category,
    categoryZh: categoryZh[category] || category,
    developer: iface.developerName || manifest.author?.name || "",
    shortDescription: iface.shortDescription || manifest.description || "",
    longDescription: iface.longDescription || manifest.description || "",
    keywords: manifest.keywords || [],
    capabilities: iface.capabilities || [],
    defaultPrompt: iface.defaultPrompt || [],
    websiteURL: iface.websiteURL || manifest.homepage || "",
    installPolicy: policy.installation || "AVAILABLE",
    auth: authLabel(policy),
    skills: countSkills(pluginDir),
    installed: installedNames.has(name),
    readmeSummary: readReadmeSummary(pluginDir),
  };
  item.summaryZh = chineseSummary(item);
  item.taskZh = typicalTask(item);
  return item;
});

const pluginMetaByName = new Map(plugins.map((plugin) => [plugin.name, plugin]));
const allSkillFiles = walk(repoRoot, (file) => path.basename(file) === "SKILL.md");
const skills = parseSkillItems(allSkillFiles, pluginMetaByName).sort((a, b) => {
  if (a.pluginDisplayName !== b.pluginDisplayName) return a.pluginDisplayName.localeCompare(b.pluginDisplayName, "zh-CN");
  return a.skillName.localeCompare(b.skillName, "zh-CN");
});

const categoryCounts = plugins.reduce((acc, plugin) => {
  acc[plugin.categoryZh] = (acc[plugin.categoryZh] || 0) + 1;
  return acc;
}, {});

const skillsTotal = plugins.reduce((sum, plugin) => sum + plugin.skills, 0);
const localSkillsTotal = skills.length;
const generatedAt = new Date().toLocaleString("zh-CN", {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function escHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const dataJson = JSON.stringify(plugins).replaceAll("</script", "<\\/script");
const categoriesJson = JSON.stringify(categoryCounts).replaceAll("</script", "<\\/script");
const skillsJson = JSON.stringify(skills).replaceAll("</script", "<\\/script");
const skillsByPlugin = skills.reduce((acc, skill) => {
  acc[skill.pluginName] = (acc[skill.pluginName] || 0) + 1;
  return acc;
}, {});
const skillsByPluginJson = JSON.stringify(skillsByPlugin).replaceAll("</script", "<\\/script");

function renderSkillsPage() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Codex 本地技能目录</title>
  <style>
    :root {
      --bg: #f7f8f6;
      --surface: #ffffff;
      --line: #dae4e1;
      --text: #17201f;
      --muted: #60706d;
      --teal: #08756f;
      --shadow: 0 14px 34px rgba(19, 44, 40, 0.08);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "Microsoft YaHei", sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--text);
      line-height: 1.56;
      background: linear-gradient(180deg, rgba(8, 117, 111, 0.05), transparent 340px), var(--bg);
    }
    a { color: inherit; }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 1px solid var(--line);
      background: rgba(247, 248, 246, 0.94);
      backdrop-filter: blur(12px);
    }
    .nav {
      max-width: 1280px;
      margin: 0 auto;
      padding: 13px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 780;
      text-decoration: none;
      color: var(--text);
      letter-spacing: 0;
    }
    .mark {
      width: 32px;
      height: 32px;
      border: 2px solid var(--text);
      border-radius: 7px;
      display: grid;
      place-items: center;
      background: #fff;
      font-size: 14px;
    }
    .navlinks {
      display: flex;
      gap: 18px;
      color: var(--muted);
      font-size: 14px;
      font-weight: 650;
      white-space: nowrap;
    }
    .navlinks a {
      text-decoration: none;
      color: inherit;
    }
    .navlinks a:hover {
      color: var(--teal);
    }
    main {
      max-width: 1280px;
      margin: 0 auto;
      padding: 42px 24px 60px;
    }
    h1 {
      margin: 0 0 16px;
      max-width: 860px;
      font-size: clamp(34px, 4.8vw, 58px);
      letter-spacing: 0;
      line-height: 0.98;
    }
    .lead {
      margin: 0;
      max-width: 940px;
      color: #40514d;
      font-size: 18px;
    }
    .hero-panel, .note, .skill-card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
      gap: 30px;
      align-items: end;
      margin-bottom: 22px;
    }
    .hero-panel {
      padding: 16px 18px;
      box-shadow: var(--shadow);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .stat {
      padding: 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfb;
    }
    .stat strong {
      display: block;
      color: var(--teal);
      font-size: 30px;
      line-height: 1.08;
    }
    .stat span {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 650;
    }
    .toolbar {
      display: grid;
      grid-template-columns: 1fr minmax(220px, 280px) minmax(150px, 200px);
      gap: 12px;
      margin-bottom: 18px;
      align-items: start;
    }
    .search {
      position: relative;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .search input,
    .search select,
    .toolbar select {
      width: 100%;
      min-height: 42px;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--surface);
      color: var(--text);
      padding: 0 12px;
      font: inherit;
      font-size: 14px;
      outline: none;
    }
    .search input {
      padding-left: 38px;
    }
    .search input:focus,
    .toolbar select:focus {
      border-color: rgba(8, 117, 111, 0.55);
      box-shadow: 0 0 0 3px rgba(8, 117, 111, 0.12);
    }
    .search::before {
      content: "🔍";
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--muted);
      font-size: 14px;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 14px;
    }
    .section-head h2 {
      margin: 0;
      font-size: 20px;
      letter-spacing: 0;
    }
    .section-head p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 13px;
    }
    .skill-card {
      padding: 15px 16px;
      min-height: 190px;
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      gap: 8px;
    }
    .skill-card h3 {
      margin: 0;
      font-size: 17px;
      line-height: 1.2;
      letter-spacing: 0;
    }
    .skill-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 2px;
    }
    .badge {
      border: 1px solid #e4ebe8;
      border-radius: 7px;
      background: #f8faf9;
      color: #4c5d59;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 650;
      white-space: nowrap;
    }
    .tag {
      border: 1px solid rgba(8, 117, 111, 0.25);
      color: #075f5a;
      background: rgba(8, 117, 111, 0.08);
      border-radius: 7px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 760;
      white-space: nowrap;
    }
    .summary {
      margin: 2px 0 0;
      color: #3b4d49;
      font-size: 14px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
    .field {
      display: grid;
      grid-template-columns: 56px 1fr;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px solid #edf1ef;
      color: #40514d;
      font-size: 12px;
    }
    .field b {
      color: var(--text);
      font-weight: 760;
    }
    .empty {
      display: none;
      padding: 30px;
      border: 1px dashed var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.75);
      color: var(--muted);
      text-align: center;
    }
    .note {
      margin-top: 26px;
      padding: 16px;
      color: var(--muted);
      font-size: 13px;
    }
    .note code {
      background: #f3f6f5;
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 1px 5px;
    }
    @media (max-width: 1120px) {
      .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .hero, .toolbar { grid-template-columns: 1fr; }
    }
    @media (max-width: 720px) {
      .nav { flex-direction: column; align-items: flex-start; }
      .navlinks { width: 100%; overflow-x: auto; padding-bottom: 2px; }
      main { padding: 30px 16px 44px; }
      .cards, .stats { grid-template-columns: 1fr; }
      .toolbar { grid-template-columns: 1fr; }
      .section-head { flex-direction: column; align-items: flex-start; }
      .field { grid-template-columns: 1fr; gap: 2px; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <nav class="nav" aria-label="主导航">
      <a class="brand" href="index.html">
        <span class="mark">C</span>
        <span>Codex 技能与插件索引</span>
      </a>
      <div class="navlinks">
        <a href="index.html">插件目录</a>
        <a href="skills.html">本地技能目录</a>
      </div>
    </nav>
  </header>
  <main>
    <section class="hero" aria-labelledby="skills-title">
      <div>
        <h1 id="skills-title">本地 SKILL 文档总览</h1>
        <p class="lead">该页面基于本机同步目录提取，可查看当前环境里可见的 604 个技能文件（可能随本地缓存变化）。每条仅保留标题与摘要，完整内容可在本机路径查看。</p>
      </div>
      <aside class="hero-panel" aria-label="统计">
        <div class="stats">
          <div class="stat"><strong>${localSkillsTotal}</strong><span>技能文件</span></div>
          <div class="stat"><strong>${skillsByPlugin ? Object.keys(skillsByPlugin).length : 0}</strong><span>所属插件</span></div>
        </div>
      </aside>
    </section>
    <section aria-label="技能目录">
      <div class="toolbar">
        <label class="search">
          <span class="visually-hidden">搜索技能</span>
          <input id="skillsSearch" type="search" placeholder="搜索技能名、插件、关键词">
        </label>
        <select id="pluginFilter" aria-label="按插件筛选">
          <option value="all">全部插件</option>
        </select>
        <select id="sortMode" aria-label="排序方式">
          <option value="plugin">按插件</option>
          <option value="name">按技能名</option>
        </select>
      </div>
      <div class="section-head">
        <h2 id="skillsResultTitle">全部技能</h2>
        <p id="skillsResultCount">${localSkillsTotal} 条结果</p>
      </div>
      <div class="cards" id="skillsCards"></div>
      <div class="empty" id="skillsEmpty">没有匹配到技能，请换一个关键词或清空筛选。</div>
      <div class="note">
        <p>来源目录：<code>/home/jim/.codex/.tmp/plugins</code>。页面不读取本机文件，仅展示基于本次构建时导出的静态快照。</p>
      </div>
    </section>
  </main>
  <script>
    const SKILLS = ${skillsJson};
    const SKILLS_BY_PLUGIN = ${skillsByPluginJson};
    const searchEl = document.querySelector("#skillsSearch");
    const pluginFilter = document.querySelector("#pluginFilter");
    const sortModeEl = document.querySelector("#sortMode");
    const cardsEl = document.querySelector("#skillsCards");
    const emptyEl = document.querySelector("#skillsEmpty");
    const resultCountEl = document.querySelector("#skillsResultCount");
    const resultTitleEl = document.querySelector("#skillsResultTitle");

    function escapeHtml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function slugDisplay(skill) {
      return escapeHtml(skill.skillSlug);
    }

    function skillCardTemplate(skill) {
      const status = skill.pluginInstalled ? "已安装缓存" : "未安装缓存";
      const pluginLabel = skill.pluginDisplayName || skill.pluginName;
      return \`
        <article class="skill-card">
          <div>
            <h3>\${escapeHtml(skill.skillName)}</h3>
            <div class="skill-meta">
              <span class="tag">\${escapeHtml(pluginLabel)}</span>
              <span class="badge">所属插件: \${escapeHtml(skill.pluginName)}</span>
              <span class="badge">\${slugDisplay(skill)}</span>
            </div>
            <p class="summary">\${escapeHtml(skill.description)}</p>
          </div>
          <div class="field"><b>状态</b><span>\${status}</span></div>
          <div class="field"><b>类别</b><span>\${escapeHtml(skill.pluginCategory || "未注明")}</span></div>
          <div class="field"><b>来源</b><span><code>\${escapeHtml(skill.sourcePath)}</code></span></div>
        </article>\`;
    }

    function renderPluginOptions() {
      const options = Object.entries(SKILLS_BY_PLUGIN).sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return String(a[0]).localeCompare(String(b[0]), "zh-CN");
      });
      for (const [pluginName, count] of options) {
        const option = document.createElement("option");
        option.value = pluginName;
        option.textContent = \`\${pluginName}（\${count}）\`;
        pluginFilter.appendChild(option);
      }
    }

    function renderSkills() {
      const query = normalize(searchEl.value);
      const pluginValue = pluginFilter.value;
      const mode = sortModeEl.value;
      let rows = SKILLS.filter((skill) => {
        if (pluginValue !== "all" && skill.pluginName !== pluginValue) return false;
        if (!query) return true;
        const haystack = normalize([
          skill.skillName,
          skill.skillSlug,
          skill.pluginName,
          skill.pluginDisplayName,
          skill.description,
          skill.pluginCategory
        ].join(" "));
        return haystack.includes(query);
      });
      rows.sort((a, b) => {
        if (mode === "name") {
          const byName = a.skillName.localeCompare(b.skillName, "zh-CN");
          if (byName !== 0) return byName;
          return a.pluginDisplayName.localeCompare(b.pluginDisplayName, "zh-CN");
        }
        if (a.pluginDisplayName === b.pluginDisplayName) {
          return a.skillName.localeCompare(b.skillName, "zh-CN");
        }
        return a.pluginDisplayName.localeCompare(b.pluginDisplayName, "zh-CN");
      });
      cardsEl.innerHTML = rows.map(skillCardTemplate).join("");
      resultCountEl.textContent = \`\${rows.length} 条结果\`;
      resultTitleEl.textContent = pluginValue === "all" ? "全部技能" : (pluginValue + " 技能");
      emptyEl.style.display = rows.length ? "none" : "block";
    }

    renderPluginOptions();
    renderSkills();

    searchEl.addEventListener("input", renderSkills);
    pluginFilter.addEventListener("change", renderSkills);
    sortModeEl.addEventListener("change", renderSkills);
  </script>
</body>
</html>`;
}

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Codex Marketplace 180 个插件中文指南</title>
  <style>
    :root {
      --bg: #f7f8f6;
      --surface: #ffffff;
      --soft: #edf5f3;
      --text: #17201f;
      --muted: #60706d;
      --line: #dae4e1;
      --teal: #08756f;
      --blue: #2f6f9f;
      --amber: #b76a1f;
      --green: #2d7b45;
      --red: #a84432;
      --shadow: 0 14px 34px rgba(19, 44, 40, 0.08);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "Microsoft YaHei", sans-serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      color: var(--text);
      background: linear-gradient(180deg, rgba(8, 117, 111, 0.06), transparent 300px), var(--bg);
      line-height: 1.58;
    }
    a { color: inherit; }
    code {
      padding: 1px 5px;
      border: 1px solid var(--line);
      border-radius: 5px;
      background: #f3f6f5;
      font-size: 0.92em;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 1px solid var(--line);
      background: rgba(247, 248, 246, 0.9);
      backdrop-filter: blur(14px);
    }
    .nav {
      max-width: 1280px;
      margin: 0 auto;
      padding: 13px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text);
      text-decoration: none;
      font-weight: 780;
      letter-spacing: 0;
    }
    .mark {
      width: 32px;
      height: 32px;
      border: 2px solid var(--text);
      border-radius: 7px;
      display: grid;
      place-items: center;
      background: #fff;
      font-size: 14px;
    }
    .navlinks {
      display: flex;
      gap: 18px;
      color: var(--muted);
      font-size: 14px;
      font-weight: 650;
      white-space: nowrap;
    }
    .navlinks a {
      color: inherit;
      text-decoration: none;
    }
    .navlinks a:hover { color: var(--teal); }
    main {
      max-width: 1280px;
      margin: 0 auto;
      padding: 42px 24px 60px;
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
      gap: 30px;
      align-items: end;
      margin-bottom: 26px;
    }
    h1 {
      margin: 0 0 16px;
      max-width: 860px;
      font-size: clamp(38px, 5.6vw, 72px);
      line-height: 0.98;
      letter-spacing: 0;
    }
    .lead {
      max-width: 840px;
      margin: 0;
      color: #40514d;
      font-size: 18px;
    }
    .hero-panel, .note, .category-panel, .card, .matrix {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    .hero-panel {
      padding: 18px;
      box-shadow: var(--shadow);
    }
    .panel-title {
      margin: 0 0 13px;
      font-size: 16px;
      font-weight: 760;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .stat {
      padding: 13px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfb;
    }
    .stat strong {
      display: block;
      color: var(--teal);
      font-size: 30px;
      line-height: 1.08;
    }
    .stat span {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 650;
    }
    .toolbar {
      display: grid;
      grid-template-columns: 1fr minmax(280px, 390px);
      gap: 14px;
      align-items: start;
      margin: 28px 0 20px;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .filter, .view-button {
      min-height: 36px;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--surface);
      color: #34423f;
      padding: 0 13px;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .filter[aria-pressed="true"], .view-button[aria-pressed="true"] {
      background: var(--teal);
      border-color: var(--teal);
      color: #fff;
    }
    .tools {
      display: grid;
      gap: 9px;
    }
    .search { position: relative; }
    .search input {
      width: 100%;
      min-height: 42px;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--surface);
      color: var(--text);
      padding: 0 42px 0 13px;
      font: inherit;
      font-size: 14px;
      outline: none;
    }
    .search input:focus {
      border-color: rgba(8, 117, 111, 0.55);
      box-shadow: 0 0 0 3px rgba(8, 117, 111, 0.12);
    }
    .search svg {
      position: absolute;
      top: 50%;
      right: 13px;
      width: 18px;
      height: 18px;
      color: var(--muted);
      transform: translateY(-50%);
    }
    .layout {
      display: grid;
      grid-template-columns: 300px minmax(0, 1fr);
      gap: 22px;
      align-items: start;
    }
    .sidebar {
      position: sticky;
      top: 78px;
      display: grid;
      gap: 14px;
    }
    .note, .category-panel { padding: 17px; }
    .note h2, .category-panel h2, .matrix h2 {
      margin: 0 0 12px;
      font-size: 18px;
      line-height: 1.25;
      letter-spacing: 0;
    }
    .note p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }
    .category-list {
      display: grid;
      gap: 7px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .category-list li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 0;
      border-top: 1px solid #edf1ef;
      font-size: 14px;
    }
    .category-list li:first-child { border-top: 0; }
    .category-list b { font-weight: 720; }
    .category-list span { color: var(--muted); }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 14px;
    }
    .section-head h2 {
      margin: 0;
      font-size: 20px;
      letter-spacing: 0;
    }
    .section-head p {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 13px;
    }
    .card {
      min-height: 300px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    }
    .card:hover {
      transform: translateY(-2px);
      border-color: rgba(8, 117, 111, 0.36);
      box-shadow: var(--shadow);
    }
    .card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .title-row {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .plugin-icon {
      flex: 0 0 auto;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      color: #fff;
      font-weight: 820;
      font-size: 15px;
      background: var(--teal);
    }
    .plugin-icon.developer { background: var(--blue); }
    .plugin-icon.creativity { background: var(--amber); }
    .plugin-icon.finance { background: #34495e; }
    .plugin-icon.productivity { background: var(--green); }
    .plugin-icon.communication { background: #7b4a91; }
    .plugin-icon.security { background: var(--red); }
    .card h3 {
      margin: 0;
      font-size: 18px;
      line-height: 1.18;
      letter-spacing: 0;
      overflow-wrap: anywhere;
    }
    .slug {
      color: var(--muted);
      font-size: 12px;
      font-weight: 650;
      margin-top: 2px;
      overflow-wrap: anywhere;
    }
    .tagline {
      margin: 0;
      color: #3b4d49;
      font-size: 14px;
    }
    .tag {
      white-space: nowrap;
      border: 1px solid rgba(8, 117, 111, 0.25);
      color: #075f5a;
      background: rgba(8, 117, 111, 0.08);
      border-radius: 7px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 760;
    }
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: auto;
    }
    .badge {
      border: 1px solid #e4ebe8;
      border-radius: 7px;
      background: #f8faf9;
      color: #4c5d59;
      padding: 4px 7px;
      font-size: 12px;
      font-weight: 650;
    }
    .field {
      display: grid;
      grid-template-columns: 64px 1fr;
      gap: 8px;
      padding-top: 9px;
      border-top: 1px solid #edf1ef;
      color: #40514d;
      font-size: 13px;
    }
    .field b {
      color: var(--text);
      font-weight: 760;
    }
    .card a {
      color: var(--teal);
      font-weight: 700;
      text-decoration: none;
    }
    .card a:hover { text-decoration: underline; }
    .empty {
      display: none;
      padding: 30px;
      border: 1px dashed var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.75);
      color: var(--muted);
      text-align: center;
    }
    .matrix {
      margin-top: 34px;
      overflow: hidden;
    }
    .matrix h2 {
      padding: 18px;
      border-bottom: 1px solid var(--line);
      margin: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th, td {
      padding: 13px 18px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--line);
    }
    th {
      background: #f3f7f5;
      color: #33433f;
      font-size: 13px;
      font-weight: 760;
    }
    tr:last-child td { border-bottom: 0; }
    footer {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px 34px;
      color: var(--muted);
      font-size: 13px;
    }
    @media (max-width: 1120px) {
      .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .hero, .layout, .toolbar { grid-template-columns: 1fr; }
      .sidebar {
        position: static;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 720px) {
      .nav {
        flex-direction: column;
        align-items: flex-start;
      }
      .navlinks {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 2px;
      }
      main { padding: 30px 16px 44px; }
      .stats, .sidebar, .cards { grid-template-columns: 1fr; }
      .section-head {
        flex-direction: column;
        align-items: flex-start;
      }
      .field { grid-template-columns: 1fr; gap: 2px; }
      th, td { padding: 11px; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <nav class="nav" aria-label="主导航">
      <a class="brand" href="#top">
        <span class="mark">C</span>
        <span>Codex Marketplace 中文指南</span>
      </a>
      <div class="navlinks">
        <a href="#catalog">插件目录</a>
        <a href="#categories">类别</a>
        <a href="#matrix">快速选择</a>
        <a href="#scope">来源范围</a>
        <a href="skills.html">本地技能目录</a>
      </div>
    </nav>
  </header>
  <main id="top">
    <section class="hero" aria-labelledby="title">
      <div>
        <h1 id="title">${plugins.length} 个 Codex Marketplace 插件，一页中文看懂。</h1>
        <p class="lead">这份网站基于本机同步的 Codex 官方 Marketplace 清单生成。它覆盖当前 ${plugins.length} 个可用插件，并把每个插件的用途、适合场景、授权方式、技能文件与官网入口整理成中文卡片。</p>
      </div>
      <aside class="hero-panel" aria-label="统计">
        <p class="panel-title">当前 Marketplace 同步范围</p>
        <div class="stats">
          <div class="stat"><strong>${plugins.length}</strong><span>可用插件</span></div>
          <div class="stat"><strong>${Object.keys(categoryCounts).length}</strong><span>类别</span></div>
          <div class="stat"><strong>${localSkillsTotal}</strong><span>本地技能文件</span></div>
        </div>
      </aside>
    </section>
    <section id="catalog" aria-label="插件目录">
      <div class="toolbar">
        <div class="filters" id="filters" role="toolbar" aria-label="按类别筛选">
          <button class="filter" type="button" data-filter="all" aria-pressed="true">全部</button>
        </div>
        <div class="tools">
          <label class="search">
            <span class="visually-hidden">搜索插件</span>
            <input id="search" type="search" placeholder="搜索插件、类别、用途或关键词...">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Zm5.2-1.8 4.4 4.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </label>
          <div class="filters" role="toolbar" aria-label="辅助筛选">
            <button class="view-button" type="button" data-view="installed" aria-pressed="false">只看已安装缓存</button>
            <button class="view-button" type="button" data-view="skills" aria-pressed="false">只看带技能</button>
            <button class="view-button" type="button" data-view="write" aria-pressed="false">只看可写入</button>
          </div>
        </div>
      </div>
      <div class="layout">
        <aside class="sidebar">
          <section class="category-panel" id="categories" aria-labelledby="cat-title">
            <h2 id="cat-title">类别分布</h2>
            <ul class="category-list" id="categoryList"></ul>
          </section>
          <section class="note" id="scope" aria-labelledby="scope-title">
            <h2 id="scope-title">来源范围</h2>
            <p>来源目录：<code>/home/jim/.codex/.tmp/plugins</code>。页面读取 Marketplace JSON、每个插件的 <code>.codex-plugin/plugin.json</code>、README 和技能文件数量。线上 Marketplace 可能继续变化。</p>
          </section>
        </aside>
        <div>
          <div class="section-head">
            <h2 id="resultTitle">全部插件</h2>
            <p id="resultCount">${plugins.length} 个结果</p>
          </div>
          <div class="cards" id="cards"></div>
          <div class="empty" id="empty">没有匹配的插件。试试搜索 “部署”、“CRM”、“邮件”、“Figma”、“金融” 或 “数据”。</div>
          <section class="matrix" id="matrix" aria-labelledby="matrix-title">
            <h2 id="matrix-title">快速选择</h2>
            <table>
              <thead><tr><th>你想做什么</th><th>优先看哪些类别</th><th>典型插件</th></tr></thead>
              <tbody>
                <tr><td>写代码、部署、排查工程问题</td><td>开发者工具</td><td>Vercel、GitHub、Supabase、Cloudflare、Sentry、CircleCI</td></tr>
                <tr><td>处理邮件、会议、聊天和文档</td><td>沟通协作、生产力</td><td>Gmail、Slack、Google Calendar、Google Drive、Notion、Teams</td></tr>
                <tr><td>做数据分析、BI 或增长洞察</td><td>数据与分析</td><td>PostHog、Mixpanel、Amplitude、Hex、ThoughtSpot、Omni Analytics</td></tr>
                <tr><td>准备销售、客户或运营工作</td><td>业务与运营、生产力</td><td>HubSpot、Apollo、ZoomInfo、Pipedrive、Intercom、Clay</td></tr>
                <tr><td>查金融市场、公司或投资资料</td><td>金融与财务</td><td>FactSet、Morningstar、PitchBook、LSEG、S&P Global、Stripe</td></tr>
                <tr><td>做设计、视频、图片或素材</td><td>创意与设计</td><td>Figma、Canva、HeyGen、Remotion、Shutterstock、BioRender</td></tr>
                <tr><td>查论文、政策或科研资料</td><td>教育与研究</td><td>Zotero、Scite、Dow Jones Factiva、PolicyNote、Life Science Research</td></tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </section>
  </main>
  <footer>生成时间：${escHtml(generatedAt)} America/Los_Angeles。这个页面解释的是本机同步到的 ${plugins.length} 个可用插件，不代表未来 Marketplace 不会新增或下架。</footer>
  <script>
    const PLUGINS = ${dataJson};
    const CATEGORY_COUNTS = ${categoriesJson};
    const categoryOrder = ["开发者工具", "生产力", "金融与财务", "业务与运营", "数据与分析", "沟通协作", "教育与研究", "创意与设计", "安全", "出行", "其他"];
    const categoryClass = {
      "开发者工具": "developer",
      "创意与设计": "creativity",
      "金融与财务": "finance",
      "生产力": "productivity",
      "沟通协作": "communication",
      "安全": "security"
    };
    const cardsEl = document.querySelector("#cards");
    const filtersEl = document.querySelector("#filters");
    const categoryListEl = document.querySelector("#categoryList");
    const searchEl = document.querySelector("#search");
    const resultCountEl = document.querySelector("#resultCount");
    const resultTitleEl = document.querySelector("#resultTitle");
    const emptyEl = document.querySelector("#empty");
    const viewButtons = Array.from(document.querySelectorAll(".view-button"));
    let activeCategory = "all";
    const activeViews = new Set();

    function escapeHtml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function initials(name) {
      return name
        .replace(/\\([^)]*\\)/g, "")
        .split(/\\s+|\\.|-/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function renderFilters() {
      const cats = categoryOrder.filter((cat) => CATEGORY_COUNTS[cat]).concat(Object.keys(CATEGORY_COUNTS).filter((cat) => !categoryOrder.includes(cat)));
      for (const cat of cats) {
        const button = document.createElement("button");
        button.className = "filter";
        button.type = "button";
        button.dataset.filter = cat;
        button.setAttribute("aria-pressed", "false");
        button.textContent = \`\${cat} \${CATEGORY_COUNTS[cat]}\`;
        filtersEl.appendChild(button);
      }
      categoryListEl.innerHTML = cats.map((cat) => \`<li><b>\${escapeHtml(cat)}</b><span>\${CATEGORY_COUNTS[cat]} 个</span></li>\`).join("");
    }

    function cardTemplate(plugin) {
      const cls = categoryClass[plugin.categoryZh] || "";
      const tags = [
        plugin.auth,
        plugin.capabilities.includes("Write") ? "可写入" : "偏读取",
        plugin.skills ? \`\${plugin.skills} 个技能\` : "连接器",
        plugin.installed ? "已安装缓存" : "可安装"
      ];
      const site = plugin.websiteURL ? \`<a href="\${escapeHtml(plugin.websiteURL)}" target="_blank" rel="noreferrer">官网</a>\` : "未提供";
      return \`
        <article class="card" data-name="\${escapeHtml(plugin.name)}">
          <div class="card-top">
            <div class="title-row">
              <div class="plugin-icon \${cls}">\${escapeHtml(initials(plugin.displayName || plugin.name))}</div>
              <div>
                <h3>\${escapeHtml(plugin.displayName)}</h3>
                <div class="slug">\${escapeHtml(plugin.name)}\${plugin.version ? " · v" + escapeHtml(plugin.version) : ""}</div>
              </div>
            </div>
            <span class="tag">\${escapeHtml(plugin.categoryZh)}</span>
          </div>
          <p class="tagline">\${escapeHtml(plugin.summaryZh)}</p>
          <div class="field"><b>典型任务</b><span>\${escapeHtml(plugin.taskZh)}</span></div>
          <div class="field"><b>开发者</b><span>\${escapeHtml(plugin.developer || "未注明")}</span></div>
          <div class="field"><b>入口</b><span>\${site}</span></div>
          <div class="badges">\${tags.map((tag) => \`<span class="badge">\${escapeHtml(tag)}</span>\`).join("")}</div>
        </article>\`;
    }

    function pluginMatches(plugin, query) {
      if (activeCategory !== "all" && plugin.categoryZh !== activeCategory) return false;
      if (activeViews.has("installed") && !plugin.installed) return false;
      if (activeViews.has("skills") && !plugin.skills) return false;
      if (activeViews.has("write") && !plugin.capabilities.includes("Write")) return false;
      if (!query) return true;
      const haystack = normalize([
        plugin.name,
        plugin.displayName,
        plugin.categoryZh,
        plugin.developer,
        plugin.summaryZh,
        plugin.taskZh,
        plugin.shortDescription,
        plugin.longDescription,
        plugin.keywords.join(" ")
      ].join(" "));
      return haystack.includes(query);
    }

    function renderCards() {
      const query = normalize(searchEl.value);
      const filtered = PLUGINS.filter((plugin) => pluginMatches(plugin, query));
      cardsEl.innerHTML = filtered.map(cardTemplate).join("");
      emptyEl.style.display = filtered.length ? "none" : "block";
      resultCountEl.textContent = \`\${filtered.length} 个结果\`;
      resultTitleEl.textContent = activeCategory === "all" ? "全部插件" : activeCategory;
    }

    renderFilters();
    renderCards();

    filtersEl.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      activeCategory = button.dataset.filter;
      for (const item of filtersEl.querySelectorAll("button[data-filter]")) {
        item.setAttribute("aria-pressed", String(item === button));
      }
      renderCards();
    });

    searchEl.addEventListener("input", renderCards);

    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.view;
        if (activeViews.has(view)) activeViews.delete(view);
        else activeViews.add(view);
        button.setAttribute("aria-pressed", String(activeViews.has(view)));
        renderCards();
      });
    });
  </script>
</body>
</html>`;

const skillsFile = path.join(workspace, "skills.html");
fs.writeFileSync(outFile, html);
fs.writeFileSync(skillsFile, renderSkillsPage());
console.log(`Wrote ${outFile}`);
console.log(`${plugins.length} plugins, ${skillsTotal} skills`);
console.log(`Wrote ${skillsFile}`);
console.log(`${localSkillsTotal} local SKILL files`);
