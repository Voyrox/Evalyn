# Evalyn

Evalyn is an AI-powered Discord bot designed for machine learning applications. It allows you to train, evaluate, and manage AI models directly within Discord. With a range of customizable settings, Evalyn aims to make AI accessible and functional for Discord communities.

## Features

### Commands

- **`export/import`**: Allows users to export and import both the model and the training dataset.
- **`help`**: Provides a comprehensive list of commands and their usage.
- **`model`**: Enables users to switch between older and newer trained models.
- **`predict`**: Given an input, predicts an output using the trained model.
- **`settings`**: Allows you to manage various settings like bot's response channel, answering in threads, enabling self-learning, and enable/disable the bot's response to prediction requests.
- **`status`**: Displays the current status of the AI model and the bot.
- **`train`**: Trains the bot on new data.

## Installation

To get started with Evalyn, you'll need to [install Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/). Then, you can clone this repository and install the necessary packages.

### Setup

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