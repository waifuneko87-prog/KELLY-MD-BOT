require('dotenv').config();

const settings = {
  packname: process.env.PACKNAME || 'KELLY-MD',
  author: process.env.PACK_AUTHOR || 'Sonali',
  botName: process.env.BOT_NAME || 'KELLY-MD',
  botOwner: process.env.BOT_OWNER || 'Sonali',
  ownerNumber: process.env.OWNER_NUMBER || '',
  giphyApiKey: process.env.GIPHY_API_KEY || '',
  commandMode: process.env.COMMAND_MODE || 'public',
  maxStoreMessages: Number(process.env.MAX_STORE_MESSAGES || 20),
  storeWriteInterval: Number(process.env.STORE_WRITE_INTERVAL || 10000),
  description: process.env.BOT_DESCRIPTION || 'Keep Running! KIRIKO!',
  version: process.env.BOT_VERSION || '2.0.0',
  updateZipUrl: process.env.UPDATE_ZIP_URL || '',
};

module.exports = settings;
