export const leagues = {
  firstDisplay: [
    [
      {
        text: 'EPL 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '152',
        }),
      },
      {
        text: 'UEFA Champions League 🇪🇺',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '3',
        }),
      },
    ],
    [
      {
        text: 'La Liga - Spain 🇪🇸',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '302',
        }),
      },
      {
        text: 'Serie A - Italy 🇮🇹',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '207',
        }),
      },
    ],
    [
      {
        text: 'Bundesliga - Germany 🇩🇪',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '175',
        }),
      },
      {
        text: 'Ligue 1 - France 🇫🇷',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '168',
        }),
      },
    ],
    [
      {
        text: 'UEFA Europa League 🇪🇺',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '4',
        }),
      },
      {
        text: 'EFL Championship 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '153',
        }),
      },
    ],
    [
      {
        text: 'Brazil Série A 🇧🇷',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '99',
        }),
      },
      {
        text: 'CONMEBOL Libertadores 🌎',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '18',
        }),
      },
    ],
    [
      {
        text: 'MLS - USA 🇺🇸',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '332',
        }),
      },
      {
        text: 'Eredivisie - Netherlands 🇳🇱',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '244',
        }),
      },
    ],
    [
      {
        text: 'Copa del Rey 🇪🇸',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '300',
        }),
      },
      {
        text: 'NPFL 🇳🇬',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '248',
        }),
      },
    ],
    [
      {
        text: 'close ❌',
        callback_data: JSON.stringify({
          command: '/close',
        }),
      },
      {
        text: '>',
        callback_data: JSON.stringify({
          command: '/nextLeaguePage',
          action: 'secondDisplay_leagues',
        }),
      },
    ],
  ],

  secondDisplay: [
    [
      {
        text: 'Primeira Liga - Portugal 🇵🇹',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '266',
        }),
      },
      {
        text: 'Turkish Süper Lig 🇹🇷',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '322',
        }),
      },
    ],
    [
      {
        text: 'Greek Super League 🇬🇷',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '178',
        }),
      },
      {
        text: 'Argentine Primera División 🇦🇷',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '43',
        }),
      },
    ],
    [
      {
        text: 'Chilean Primera División 🇨🇱',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '115',
        }),
      },
      {
        text: 'CONMEBOL Sudamericana 🌎',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '385',
        }),
      },
    ],
    [
      {
        text: 'Norwegian Eliteserien 🇳🇴',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '253',
        }),
      },
      {
        text: 'Swiss Superleague 🇨🇭',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '308',
        }),
      },
    ],
    [
      {
        text: 'Austrian Bundesliga 🇦🇹',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '56',
        }),
      },
      {
        text: 'Allsvenskan - Sweden 🇸🇪',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '307',
        }),
      },
    ],
    [
      {
        text: 'Belgium First Div 🇧🇪',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '63',
        }),
      },
      {
        text: 'Danish Superliga 🇩🇰',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '135',
        }),
      },
    ],
    [
      {
        text: '<',
        callback_data: JSON.stringify({
          command: '/prevLeaguePage',
          action: 'firstDisplay_leagues',
        }),
      },
      {
        text: '>',
        callback_data: JSON.stringify({
          command: '/nextLeaguePage',
          action: 'thirdDisplay_leagues',
        }),
      },
    ],
  ],

  thirdDisplay: [
    [
      {
        text: 'Russian Premier League 🇷🇺',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '344',
        }),
      },
      {
        text: 'Scottish Cup 🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '280',
        }),
      },
    ],
    [
      {
        text: 'Polish Ekstraklasa 🇵🇱',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '259',
        }),
      },
      {
        text: 'Finnish Veikkausliiga 🇫🇮',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '352',
        }),
      },
    ],
    [
      {
        text: 'K League 1 - Korea 🇰🇷',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '219',
        }),
      },
      {
        text: 'Liga MX - Mexico 🇲🇽',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '634',
        }),
      },
    ],
    [
      {
        text: 'J1 League - Japan 🇯🇵',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '209',
        }),
      },
      {
        text: 'Chinese Super League 🇨🇳',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '118',
        }),
      },
    ],
    [
      {
        text: 'A-League - Australia 🇦🇺',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '',
        }),
      },
      {
        text: 'Saudi Pro League 🇸🇦',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '278',
        }),
      },
    ],
    [
      {
        text: 'PSL -South African 🇿🇦',
        callback_data: JSON.stringify({
          command: '/leagueSelected',
          id: '297',
        }),
      },
    ],
    [
      {
        text: '<',
        callback_data: JSON.stringify({
          command: '/prevLeaguePage',
          action: 'secondDisplay_leagues',
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
