# ⚡  Axtonix Discord.js Template

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
- **pnpm** package manager

Install pnpm:

```bash
npm install -g pnpm
```

### 2. Clone & Install

```bash
git clone https://github.com/rugved-danej/axtonix-discordjs-template.git
cd axtonix-discordjs-template
pnpm install
```

## 🔧 Configuration

Edit the file configs/client.json:

```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "prefix": ".",
  "clientId": "YOUR_CLIENT_ID",
  "owners": ["YOUR_ID"],
  "intents": ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
  "partials": ["Message", "Channel", "Reaction"],
  "database": {
    "enabled": true,
    "supabaseUrl": "YOUR_SUPABASE_URL",
    "supabaseKey": "YOUR_SUPABASE_KEY"
  },
  "guildOnlyMode": false,
  "allowedGuilds": ["YOUR_GUILD_ID"],
  "errorChannel": "YOUR_ERROR_CHANNEL_ID_HERE"
}
```

> Make sure to enable Message Content Intent in the Discord Developer Portal.

## 🚀 Running the Bot

Development (auto-restart):

```
pnpm run dev
```

Production:

```
pnpm start
```

Production (Using PM2):

```
pnpm run pm2:start     # Start
pnpm run pm2:monitor   # View logs
pnpm run pm2:stop      # Stop
```

## 📁 Project Structure

```
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
```

## 🧩 Creating Commands

### Slash Command Example

commands/slash/general/ping.js

```
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong! 🏓');
  }
};
```

### Prefix Command Example

commands/normal/general/ping.js

```
module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  async execute(message) {
    message.reply('Pong! 🏓');
  }
};
```

## 🗄️ Database (MongoDB)

Enabled/disabled via configs/client.json

Gracefully handles errors and still lets the bot run

Exposes client.mongoose for schemas

## 🔒 Guild-Only Mode

Add to your client.json:

```
"guildOnlyMode": true,
"allowedGuilds": ["YOUR_GUILD_ID"]
```

The bot will:

Leave unauthorized servers on startup

Leave instantly when added to a non-allowed server

## 📝 License

Distributed under the ISC License.

<div align="center">
Made with ❤️ by <a href="https://github.com/rugved-danej">Rugved</a>
</div>
