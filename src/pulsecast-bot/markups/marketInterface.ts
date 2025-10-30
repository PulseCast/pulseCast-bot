// export const marketInterface = async () => {
//   return {
//     message: `<b>⚽ Man City vs Newcastle</b>  🟢time \n\n<b>📊 Market :</b>\n\n<b>Home 🔴👕:</b> Man City |~0.3| <i>Pot- $20</i>\n<b>Draw:</b> |~0.3| <i>Pot- $40</i>\n<b>Away 🔵👕:</b>Newcastle |~0.6| <i>Pot- $60</i>\n\n<b>Total Pot: $110</b>`,
//     keyboard: [
//       [
//         {
//           text: 'Home 🔴👕',
//           callback_data: JSON.stringify({
//             command: `/home`,
//             id: `home`,
//           }),
//         },
//         {
//           text: 'Draw',
//           callback_data: JSON.stringify({
//             command: `/draw`,
//             id: `draw`,
//           }),
//         },
//         {
//           text: 'Away 🔵👕',
//           callback_data: JSON.stringify({
//             command: `/draw`,
//             id: `draw`,
//           }),
//         },
//       ],
//       [
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

export const marketInterface = (
  matchId: string,
  match: any,
  marketData: any,
) => {
  const {
    event_home_team,
    event_away_team,
    event_time,
    event_status,
    event_live,
  } = match;

  // Determine match state text
  const matchState =
    event_status === '' && event_live === '0'
      ? '🟡 Pre-Match'
      : event_live === '1'
        ? '🟢 Live'
        : '🔴 Finished';

  return {
    message: `<b>⚽ ${event_home_team} vs ${event_away_team}</b>  ${matchState}
<b>🕒 ${event_time}</b>

<b>📊 Market :</b>

<b>● Home 🔴👕:</b> ${event_home_team} | <i>≈${marketData.home}</i> | Pot: $${marketData.homePot}

<b>● Draw:</b> | <i>≈${marketData.draw}</i> | Pot: $${marketData.drawPot}

<b>● Away 🔵👕:</b> ${event_away_team} | <i>≈${marketData.away}</i> | Pot: $${marketData.awayPot}


<b>Total Pot: $${marketData.totalPot}</b>
<i>Select an outcome to place your position.</i>`,
    keyboard: [
      [
        {
          text: `Home 🔴👕`,
          callback_data: JSON.stringify({
            command: `/buyHome`,
            mId: `${matchId}`,
          }),
        },
        {
          text: `Draw`,
          callback_data: JSON.stringify({
            command: `/buyDraw`,
            mId: `${matchId}`,
          }),
        },
        {
          text: `Away 🔵👕`,
          callback_data: JSON.stringify({
            command: `/buyAway`,
            mId: `${matchId}`,
          }),
        },
      ],
      [
        {
          text: 'Close ❌',
          callback_data: JSON.stringify({
            command: '/close',
          }),
        },
      ],
    ],
  };
};
