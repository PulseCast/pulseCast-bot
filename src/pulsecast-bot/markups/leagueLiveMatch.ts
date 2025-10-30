import { formatLiveScore } from 'src/utils/helper-functions';
import { getLeagueById } from 'src/utils/leagueDetails';

// export const leagueLiveMatch = async (leagueId: string) => {
//   const league = getLeagueById(leagueId);
//   return {
//     message: `<b>${league.text} - 🟢 LIVE Matches</b>\n\n⚽ Chelsea 2 - 1 Arsenal\n⏱️ 78' | Status: 2nd Half\n\n⚽ Man City 0 - 0 Newcastle\n⏱️ 45' | Status: Half-Time\n\n⚽ Liverpool 3 - 0 Fulham\n⏱️ 90+2' | Status: Extra Time`,
//     keyboard: [
//       [
//         {
//           text: '🔁 Refresh',
//           callback_data: JSON.stringify({
//             command: `/refresh`,
//             id: `${leagueId}`,
//           }),
//         },
//         {
//           text: 'close ❌',
//           callback_data: JSON.stringify({
//             command: '/close',
//           }),
//         },
//       ],
//     ],
//   };
// };

export const leagueLiveMatch = async (leagueId: string, liveMatches: any[]) => {
  const league = getLeagueById(leagueId);

  const liveOnly = liveMatches.filter(
    (m) =>
      m.event_live === true &&
      !m.event_status?.toLowerCase().includes('finished'),
  );

  if (liveOnly.length === 0) {
    return {
      message: `<b>${league.text} - 🟢 LIVE Matches</b>\n\nNo live matches at the moment.`,
      keyboard: [
        [
          {
            text: '🔁 Refresh',
            callback_data: JSON.stringify({
              command: '/refresh',
              id: `${leagueId}`,
            }),
          },
          {
            text: 'close ❌',
            callback_data: JSON.stringify({ command: '/close' }),
          },
        ],
      ],
    };
  }

  let message = `<b>${league.text} - 🟢 LIVE Matches</b>\n\n`;

  for (const match of liveOnly) {
    const { score, playtime, status } = formatLiveScore(match);

    message += `⚽ ${match.event_home_team} ${score} ${match.event_away_team}\n`;
    message += `⏱️ ${playtime} | Status: ${status}\n<a href="${process.env.BOT_URL}?start=bet_${match.event_key}">trade</a>\n\n`;
  }

  return {
    message: message.trim(),
    keyboard: [
      [
        {
          text: '🔁 Refresh',
          callback_data: JSON.stringify({
            command: '/refresh',
            id: `${leagueId}`,
          }),
        },
        {
          text: 'close ❌',
          callback_data: JSON.stringify({ command: '/close' }),
        },
      ],
    ],
  };
};
