const cron = require('node-cron');
const economy = require('./economy');
const { container } = require('@sapphire/framework');

// Every minute, run economy cron job
cron.schedule('* * * * *', () => economy.run());

container.logger.info(`Scheduled all cron jobs.`);
