import { to_12Hour } from 'src/utils/helper-functions';

export const displayUserPositions = (positions: any[]) => {
  if (!positions || positions.length === 0) {
    return {
      message: `<b>You have no active positions.</b>`,
      keyboard: [
        [
          {
            text: 'close ❌',
            callback_data: JSON.stringify({ command: '/close' }),
          },
        ],
      ],
    };
  }

  // Group positions by match date
  const grouped = positions.reduce(
    (acc, pos) => {
      const match = pos.market.match;

      console.log(match);
      const date = match.startTime;
      if (!acc[date]) acc[date] = [];
      acc[date].push(pos);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  let message = `<b>📊 Your Positions</b>\n\n`;

  for (const date in grouped) {
    for (const pos of grouped[date]) {
      const match = pos.market.match;
      const time = to_12Hour(match.startTime);

      message += `⚽ <b>${match.homeTeam.name} vs ${match.awayTeam.name}</b> — ${time}\n`;
      message += `• Position: <b>${pos.side}</b>\n`;
      message += `• Shares: ${pos.shares}\n`;
      message += `• Entry Probability: ${pos.entryProbability}\n`;
      message += `• Stake Paid: ${pos.stakePaid}\n`;
      message += `<a href="${process.env.BOT_URL}?start=sell_${pos._id.toString()}">cashout</a>\n\n`;
    }

    message += `\n`;
  }

  return {
    message,
    keyboard: [
      [
        {
          text: 'close ❌',
          callback_data: JSON.stringify({ command: '/close' }),
        },
      ],
    ],
  };
};
