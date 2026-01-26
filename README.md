# Evalyn

Discord bot with a small TensorFlow.js model for intent classification and canned responses.

## Setup

1) Install deps

```bash
npm install
```

2) Create `.env`

```bash
TOKEN=your_discord_bot_token
```

3) Start

```bash
npm start
```

## Project Layout

- `index.js`: entrypoint (loads config, commands/events, registers slash commands)
- `src/commands`: slash commands
- `src/events`: Discord events
- `src/context`: in-memory app context (config manager)
- `src/NeuralNetwork`: training/session utilities
- `src/database/db.json`: training dataset + responses
- `src/database/StatsConf.json`: bot config + stats
