export const eventDetailInterface = (payload) => {
  const isActive = payload.eventStatus === 'active';

  const matchState = isActive ? '🟢 Active' : '🔴 Finalized';

  const volumeFormatted = Number(payload.volume).toLocaleString();
  if (isActive) {
    return {
      message: `<b>⚽ ${payload.title} Winner?</b> ${matchState}\n<i>${payload.subTitle}</i>\n\n${payload.secondaryRule}\n\n$${volumeFormatted} Vol`,
      keyboard: [
        [
          {
            text: `${payload.market1.yes_sub_title} 🟦👕`,
            callback_data: JSON.stringify({
              command: `/`,
            }),
          },
        ],
        [
          {
            text: `Yes ${payload.market1.yes_ask}¢`,
            callback_data: JSON.stringify({
              command: `/buyYes`,
            }),
          },
          {
            text: `No ${payload.market1.no_ask}¢`,
            callback_data: JSON.stringify({
              command: `/buyYes`,
            }),
          },
        ],
        [
          {
            text: `Draw`,
            callback_data: JSON.stringify({
              command: `/`,
            }),
          },
        ],
        [
          {
            text: `Yes ${payload.market3.yes_ask}¢`,
            callback_data: JSON.stringify({
              command: `/buyYes`,
            }),
          },
          {
            text: `No ${payload.market3.no_ask}¢`,
            callback_data: JSON.stringify({
              command: `/buyYes`,
            }),
          },
        ],
        [
          {
            text: `${payload.market2.yes_sub_title}  🟥👕`,
            callback_data: JSON.stringify({
              command: `/`,
            }),
          },
        ],
        [
          {
            text: `Yes ${payload.market2.yes_ask}¢`,
            callback_data: JSON.stringify({
              command: `/buyYes`,
            }),
          },
          {
            text: `No ${payload.market2.no_ask}¢`,
            callback_data: JSON.stringify({
              command: `/buyYes`,
            }),
          },
        ],
        [
          {
            text: 'Close ❌',
            callback_data: JSON.stringify({ command: '/close' }),
          },
        ],
      ],
    };
  }

  return {
    message: `<b>⚽ ${payload.title} Winner?</b> ${matchState}\n<i>${payload.subTitle}</i>\n\n${payload.secondaryRule}`,
    keyboard: [
      [
        {
          text: 'Outcome Determined',
          callback_data: JSON.stringify({ command: '/' }),
        },
      ],
      [
        {
          text: 'Close ❌',
          callback_data: JSON.stringify({ command: '/close' }),
        },
      ],
    ],
  };
};
