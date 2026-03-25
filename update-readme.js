const fs = require('fs');
const { execSync } = require('child_process');

const readmeContent = `# ⚡  Axtonix Discord.js Template

<div align="center">

![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js->=18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

A clean, modular, and production-ready Discord.js v14 bot template.  
Axtonix includes dual command systems, automatic slash syncing, powerful event handling, MongoDB support, and beautiful logging — all out of the box.

</div>

## ✨ Features

- **Dual Command System** — Slash commands + prefix commands
- **Auto Slash Syncing** — Create/update/delete global commands on startup
- **Guild-Only Mode** — Automatically leave unauthorized servers
- **Rich Logger** — Colorful logs for commands, events, errors, and status
- **Modular Architecture** (Handlers, Events, Configs, Utils)
- **MongoDB Support** with graceful fallback
- **PM2 Ready** — Production deployment included
- **Component Examples** (Buttons, Select Menus, etc.)

## 📦 Installation

### 1. Requirements

- Node.js **18+**
- Your preferred Node package manager (\`npm\`, \`pnpm\`, or \`yarn\`)

### 2. Clone & Install

\`\`\`bash
git clone https://github.com/rugved-danej/axtonix-discordjs-template.git
cd axtonix-discordjs-template
\`\`\`

**Install Dependencies:**
- **npm:** \`npm install\`
- **pnpm:** \`pnpm install\`
- **yarn:** \`yarn install\`

## 🔧 Configuration

Edit the file configs/client.json:

\`\`\`json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "prefix": ".",
  "clientId": "YOUR_CLIENT_ID",
  "owners": ["YOUR_ID"],
  "intents": ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
  "partials": ["Message", "Channel", "Reaction"],
  "database": {
    "enabled": true,
    "mongoUri": "YOUR_MONGODB_ATLAS_CONNECTION_STRING"
  },
  "guildOnlyMode": false,
  "allowedGuilds": ["YOUR_GUILD_ID"],
  "errorChannel": "YOUR_ERROR_CHANNEL_ID_HERE"
}
\`\`\`

> Make sure to enable Message Content Intent in the Discord Developer Portal.

## 🚀 Running the Bot

**Development (auto-restart):**
- **npm:** \`npm run dev\`
- **pnpm:** \`pnpm run dev\`
- **yarn:** \`yarn dev\`

**Production:**
- **npm:** \`npm start\`
- **pnpm:** \`pnpm start\`
- **yarn:** \`yarn start\`

**Production (Using PM2):**
- **npm:** \`npm run pm2:start\`
- **pnpm:** \`pnpm run pm2:start\`
- **yarn:** \`yarn pm2:start\`

## 📁 Project Structure

\`\`\`text
axtonix-discordjs-template/
├── commands/
│   ├── normal/        # Prefix commands
│   └── slash/         # Slash commands (auto-synced)
├── configs/           # Config files (Token, Colors, Emojis, DB)
├── events/            # Event listeners
├── handlers/          # Command loaders, event loader, slash sync
├── utils/             # Logger, color utils
├── ecosystem.config.js# PM2 configuration
└── index.js           # Entry point
\`\`\`

## 🧩 Creating Commands

### Slash Command Example

commands/slash/general/ping.js

\`\`\`javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong! 🏓');
  }
};
\`\`\`

### Prefix Command Example

commands/normal/general/ping.js

\`\`\`javascript
module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  async execute(message) {
    message.reply('Pong! 🏓');
  }
};
\`\`\`

## 🗄️ Database (MongoDB)

Enabled/disabled via configs/client.json

Gracefully handles errors and still lets the bot run

Exposes client.mongoose for schemas

## 🔒 Guild-Only Mode

Add to your client.json:

\`\`\`json
"guildOnlyMode": true,
"allowedGuilds": ["YOUR_GUILD_ID"]
\`\`\`

The bot will:

Leave unauthorized servers on startup

Leave instantly when added to a non-allowed server

## 📝 License

Distributed under the ISC License.

<div align="center">
Made with ❤️ by <a href="https://github.com/rugved-danej">Rugved</a>
</div>
`;

try {
  console.log("📝 Writing updated README.md...");
  fs.writeFileSync('README.md', readmeContent, 'utf8');
  console.log("✅ README.md updated successfully.\n");

  console.log("🚀 Staging README.md...");
  execSync('git add .', { stdio: 'inherit' });
  
  console.log("\n🚀 Committing changes...");
  execSync('git commit -m "docs: update README for multi-package manager and MongoDB Atlas support"', { stdio: 'inherit' });
  
  console.log("\n🚀 Pushing to GitHub...");
  execSync('git push', { stdio: 'inherit' });

  console.log("\n🎉 All done! Your repo is now up to date.");
  
  // Optionally delete the script after it runs so it doesn't clutter your repo
  fs.unlinkSync('update-readme.js');
  
} catch (error) {
  console.error("❌ An error occurred:", error.message);
}

