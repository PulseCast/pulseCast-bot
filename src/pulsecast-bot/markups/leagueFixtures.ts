import { to12Hour } from 'src/utils/helper-functions';
import { getLeagueById } from 'src/utils/leagueDetails';

const sortFixtures = (fixtures: any[]) => {
  return [...fixtures].sort((a, b) => {
    const dateA = new Date(`${a.event_date} ${a.event_time}`);
    const dateB = new Date(`${b.event_date} ${b.event_time}`);
    return dateA.getTime() - dateB.getTime(); // earliest first
  });
};

export const leaguefixtures = async (
  leagueId: string,
  fixtures: any[],
  chatId: string,
) => {
  const regexGroupId = /^-.+/;
  let isFromGroup = false;

  if (regexGroupId.test(chatId)) {
    isFromGroup = true;
  }
  const league = getLeagueById(leagueId);

  // ✅ Sort fixtures by date & time
  fixtures = sortFixtures(fixtures);

  let date;
  // Group fixtures by date
  const grouped = fixtures.reduce(
    (acc, match) => {
      date = match.event_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(match);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  let message = `<b>📅 ${league.text} - Upcoming Fixtures</b>\n\n`;

  // Build formatted message
  // for (const date in grouped) {
  //   message += `🗓️ ${formatDate(date)}\n`;

  //   for (const match of grouped[date]) {
  //     const time = to12Hour(match.event_time);
  //     message += `⚽ ${match.event_home_team} vs ${match.event_away_team} — ${time} <a href="${process.env.BOT_URL}?start=bet_${match.event_key}">trade</a>\n`;
  //   }

  //   message += `\n`;
  // }

  for (const match of grouped[date]) {
    const time = to12Hour(match.event_time);

    const startParam = isFromGroup
      ? `bet_${match.event_key}_group_${chatId}`
      : `bet_${match.event_key}`;

    message += `⚽ ${match.event_home_team} vs ${match.event_away_team} — ${time} <a href="${process.env.BOT_URL}?start=${startParam}">trade</a>\n`;
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
