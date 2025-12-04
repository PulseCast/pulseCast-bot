export const eventInterface = (payload) => {
  const isActive = payload.eventStatus === 'active';

  const matchState = isActive ? '🟢 Active' : '🔴 Finalized';

  const keyboard = [
    [
      {
        text: 'Close ❌',
        callback_data: JSON.stringify({ command: '/close' }),
      },
    ],
  ];

  // If active, insert Trade button ABOVE the Close button
  if (isActive) {
    keyboard.unshift([
      {
        text: 'Trade 📊',
        url: `${process.env.BOT_URL}?start=trade_${payload.eventTicker}`,
      } as any,
    ]);
  }

  return {
    message: `<b>⚽ ${payload.title} Winner?</b> ${matchState}\n<i>${payload.subTitle}</i>\n\n${payload.secondaryRule}`,
    keyboard,
  };
};
