export const acceptedDisclaimerMessageMarkup = async (
  walletAddress: string,
) => {
  return {
    message: `🎯 Great! You’re all set.\n\n\nRemember ⇢ predictions are meant to be fun, social, and transparent.\nYou can create private pots with friends or join public ones to test your intuition.\n\n<b>Wallet :</b> <code>${walletAddress}</code>\n\nWhat would you like to do next?`,
    keyboard: [
      [
        {
          text: '💳 Wallet',
          callback_data: JSON.stringify({
            command: '/walletDetails',
          }),
        },
        {
          text: '➕ Add to Group',
          url: `${process.env.BOT_URL}?startgroup=true`,
        },
      ],
      [
        {
          text: '⚽ Leagues',
          callback_data: JSON.stringify({
            command: `/leagues`,
          }),
        },
      ],
      [
        // {
        //   text: '🗓 Today’s Fixtures',
        //   callback_data: JSON.stringify({
        //     command: `/todaysFixtures`,
        //   }),
        // },
        {
          text: '🗓 Fixtures',
          callback_data: JSON.stringify({
            command: `/fixtures`,
          }),
        },
        {
          text: '🟢 Live Matches',
          callback_data: JSON.stringify({
            command: `/liveMatches`,
          }),
        },
        {
          text: '⏭ Upcoming Fixtures',
          callback_data: JSON.stringify({
            command: `/nextFixtures`,
          }),
        },
      ],
    ],
  };
};
