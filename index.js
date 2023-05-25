const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
const bot = new TelegramBot('6121433284:AAGhX3tQXWrfDmG-u7Kk9POSU-qeRE9vVcY', { polling: true });

// Function to retrieve Bitcoin halving status
async function getBitcoinHalvingStatus() {
  try {
    const response = await axios.get('https://api.blockchain.info/q/halvingcountdown');
    const halvingCountdown = response.data;

    return `The next Bitcoin halving is in ${halvingCountdown} blocks.`;
  } catch (error) {
    console.error('Error retrieving Bitcoin halving status:', error);
    return 'An error occurred while retrieving the Bitcoin halving status.';
  }
}

// Function to send halving status message to the Telegram chat
function sendHalvingStatusMessage(chatId) {
  getBitcoinHalvingStatus()
    .then((message) => {
      bot.sendMessage(chatId, message);
    })
    .catch((error) => {
      console.error('Error sending halving status message:', error);
    });
}

// Handle "/start" command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Bitcoin Halving Status Bot!');
});

// Handle "/status" command
bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  sendHalvingStatusMessage(chatId);
});

// Schedule the halving status message every 1 minute
const interval = 60 * 1000; // 1 minute in milliseconds

setInterval(() => {
  sendHalvingStatusMessage(CHAT_ID); // Replace CHAT_ID with the actual chat ID to send the message to
}, interval);
