export const acceptDisclaimerMessageMarkup = async () => {
  return {
    message: `🎯 Great! You’re all set.\n\n\nRemember ⇢ predictions are meant to be fun, social, and transparent.\nYou can create private pots with friends or join public ones to test your intuition.\n\nWhat would you like to do next?`,
    keyboard: [
      [
        {
          text: '💰 Create Pot',
          callback_data: JSON.stringify({
            command: `/createPot`,
          }),
        },
      ],
      [
        {
          text: '💰 Join Pot',
          callback_data: JSON.stringify({
            command: `/joinPot`,
          }),
        },
      ],
      [
        {
          text: '🔥 Trending Events ',
          callback_data: JSON.stringify({
            command: `/trendingEvents`,
          }),
        },
      ],
      [
        {
          text: '➕ Add to Group',
          url: `${process.env.BOT_URL}?startgroup=true`,
        },
      ],
    ],
  };
};
