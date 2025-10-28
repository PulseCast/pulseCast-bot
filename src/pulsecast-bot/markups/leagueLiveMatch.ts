import { getLeagueById } from 'src/utils/leagueDetails';

export const leagueLiveMatch = async (leagueId: string) => {
  const league = getLeagueById(leagueId);
  return {
    message: `<b>${league.text} - 🟢 LIVE Matches</b>\n\n⚽ Chelsea 2 - 1 Arsenal\n⏱️ 78' | Status: 2nd Half\n\n⚽ Man City 0 - 0 Newcastle\n⏱️ 45' | Status: Half-Time\n\n⚽ Liverpool 3 - 0 Fulham\n⏱️ 90+2' | Status: Extra Time`,
    keyboard: [
      [
        {
          text: '🔁 Refresh',
          callback_data: JSON.stringify({
            command: `/refresh`,
            id: `${leagueId}`,
          }),
        },
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
