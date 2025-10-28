import { getLeagueById } from 'src/utils/leagueDetails';

export const leaguefixtures = async (leagueId: string) => {
  const league = getLeagueById(leagueId);
  return {
    message: `<b> 📅 ${league.text} - Upcoming Fixtures</b>\n\n🗓️ Fri, Oct 31\n⚽ Tottenham vs Everton — 20:00\n\n🗓️ Sat, Nov 1\n⚽ Aston Villa vs West Ham — 17:30\n⚽ Chelsea vs Brentford — 21:00\n\n🗓️ Sun, Nov 2\n⚽ Arsenal vs Man United — 17:00`,
    keyboard: [
      [
        //add next page
        // {
        //   text: '🔁 Refresh',
        //   callback_data: JSON.stringify({
        //     command: `/refresh`,
        //     id: `${leagueId}`,
        //   }),
        // },
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
