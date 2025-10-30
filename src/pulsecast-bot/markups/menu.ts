export const menuMarkup = async () => {
  return {
    message: `Menu:`,
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
        {
          text: '📈 view Position',
          callback_data: JSON.stringify({
            command: `/positions`,
          }),
        },
      ],
      // [
      //   // {
      //   //   text: '🗓 Today’s Fixtures',
      //   //   callback_data: JSON.stringify({
      //   //     command: `/todaysFixtures`,
      //   //   }),
      //   // },
      //   // {
      //   //   text: '🗓 Fixtures',
      //   //   callback_data: JSON.stringify({
      //   //     command: `/fixtures`,
      //   //   }),
      //   // },
      //   // {
      //   //   text: '🟢 Live Matches',
      //   //   callback_data: JSON.stringify({
      //   //     command: `/liveMatches`,
      //   //   }),
      //   // },
      //   // {
      //   //   text: '⏭ Upcoming Fixtures',
      //   //   callback_data: JSON.stringify({
      //   //     command: `/nextFixtures`,
      //   //   }),
      //   // },
      // ],
    ],
  };
};
