import { getLeagueById } from 'src/utils/leagueDetails';

export const leagueAction = async (leagueId: string) => {
  const league = getLeagueById(leagueId);
  return {
    message: `<b>${league.text}</b>\nChoose what you want to see: 👇`,
    keyboard: [
      [
        {
          text: '📅 Fixtures',
          callback_data: JSON.stringify({
            command: `/fixture`,
            id: `${leagueId}`,
          }),
        },
        {
          text: '🟢 Live',
          callback_data: JSON.stringify({
            command: `/live`,
            id: `${leagueId}`,
          }),
        },
      ],
    ],
  };
};
