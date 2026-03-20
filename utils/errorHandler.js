const { 
  ContainerBuilder, 
  AttachmentBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  MessageFlags 
} = require("discord.js");
const config = require("../configs/client.json");
const logger = require("./logger");
const os = require("os");

// Smart Deduplication: Store hash of error to prevent spam
const errorCache = new Map();
const DEDUPLICATION_TIME = 300000; // 5 minutes

async function sendErrorLog(client, error, context = "Unknown", url = null) {
  const errorId = `${context}-${error?.message}-${error?.stack?.slice(0, 50)}`;
  const now = Date.now();

  // Deduplication logic
  if (errorCache.has(errorId) && (now - errorCache.get(errorId)) < DEDUPLICATION_TIME) return;
  errorCache.set(errorId, now);

  // Local file log integration
  logger.error(`[${context}] ${error?.stack || error?.message}`);

  if (!config.errorChannel || config.errorChannel === "YOUR_ID") return;

  try {
    const channel = await client.channels.fetch(config.errorChannel).catch(() => null);
    if (!channel) return;

    const files = [];
    let stackDisplay = `\`\`\`js\n${String(error?.stack || "No Stack").slice(0, 800)}\n\`\`\``;

    // Stack Trace File Upload if too long
    if (String(error?.stack).length > 1000) {
      const logBuffer = Buffer.from(error.stack, "utf-8");
      files.push(new AttachmentBuilder(logBuffer, { name: "stacktrace.txt" }));
      stackDisplay = "⚠️ *Stack trace exceeded limit. See attached file.*";
    }

    // Environmental Context
    const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const load = os.loadavg()[0].toFixed(2);
    const envContext = `**RAM:** ${mem}MB | **Load:** ${load} | **OS:** ${os.platform()}`;

    const container = new ContainerBuilder()
      .setAccentColor(0xff0000)
      .addTextDisplayComponents(
        (t) => t.setContent(`## 🚨 System Error: ${context}`),
        (t) => t.setContent(`**Message:** ${error?.message || "Unknown"}`),
        (t) => t.setContent(stackDisplay),
        (t) => t.setContent(`-# ${envContext}`)
      );

    const payload = {
      components: [container],
      files,
      flags: [MessageFlags.IsComponentsV2]
    };

    // Jump to Context Button
    if (url) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Jump to Message").setStyle(ButtonStyle.Link).setURL(url)
      );
      payload.components.push(row);
    }

    await channel.send(payload);
  } catch (err) {
    console.error("Critical Failure in Error Handler:", err);
  }
}

module.exports = { sendErrorLog };
