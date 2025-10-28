export const allFixtures = async () => {
  return {
    message: `<b> 📅  Upcoming Fixtures</b>\n\n🗓️ Fri, Oct 31\n⚽ Tottenham vs Everton — 20:00\n\n🗓️ Sat, Nov 1\n⚽ Aston Villa vs West Ham — 17:30\n⚽ Chelsea vs Brentford — 21:00\n\n🗓️ Sun, Nov 2\n⚽ Arsenal vs Man United — 17:00`,
    keyboard: [
      [
        //add next page

        {
          text: 'close ❌',
          callback_data: JSON.stringify({
            command: '/close',
          }),
        },
      ],
    ],
  };
};
