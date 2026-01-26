# Evalyn

Evalyn is an AI-powered Discord bot designed for machine learning applications. It allows you to train, evaluate, and manage AI models directly within Discord. With a range of customizable settings, DOCUMENTOR aims to make AI accessible and functional for Discord communities.

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

To get started with DOCUMENTOR, you'll need to [install Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/). Then, you can clone this repository and install the necessary packages.

```bash
git clone https://github.com/Frost-Lord/DOCUMENTOR.git
cd DOCUMENTOR
npm install
npm start
```

# DOCUMENTOR To-Do List

This to-do list tracks the features and commands that need to be developed or improved in the DOCUMENTOR bot.

## Commands

### share
- [ ] Implement export functionality for the model + training dataset.
- [ ] Implement import functionality for the model + training dataset.
- [ ] Add error handling for unsuccessful import/export operations.

### status
- [ ] Implement a status command to show the bot's current state.
- [ ] Show the status of the currently selected model (idle, training, evaluating).
- [ ] Add the ability to show various statistics about the model (accuracy, loss, etc.).

## General Improvements
- [ ] Implement a logging system to keep track of commands and model changes.
- [ ] Optimize code for better performance.
- [ ] Add unit tests for critical functions.
