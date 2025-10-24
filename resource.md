┌──────────┐ ┌────────────┐ ┌───────────────┐ ┌──────────────┐
│ Telegram │ ---> │ Bot Server │ ---> │ Solana Wallet │ ---> │ On-chain Pot │
└──────────┘ └────────────┘ └───────────────┘ └──────────────┘
↑ │ │ │
│ │ └──> Manage deposits/payouts
│ └──> Process bets, update scores, Poisson odds
└──> Show markets, accept bets, display live odds

                   ┌────────────────────┐
                   │ Telegram Bot (UI)  │
                   └────────┬───────────┘
                            │
                ┌───────────▼────────────┐
                │  Backend (NestJS API)  │
                │ - Pot mgmt             │
                │ - User auth & wallets  │
                │ - Settlement scheduler │
                └───────────┬────────────┘
                            │
     ┌──────────────────────▼──────────────────────┐
     │ Polymarket GraphQL / Oracle API             │
     │ - Market status, result verification        │
     └──────────────────────┬──────────────────────┘
                            │
        ┌──────────────────▼──────────────────┐
        │ Wallet & Escrow Layer               │
        │ (Custodial or Smart Contract)       │
        │ - Stake collection                  │
        │ - Reward distribution               │
        └──────────────────┬──────────────────┘
                            │
        ┌──────────────────▼──────────────────┐
        │ MongoDB / PostgreSQL Database        │
        │ - Users, pots, bets, transactions    │
        └──────────────────────────────────────┘


                 ┌──────────────────────────────┐
                 │        Telegram Bot          │
                 │ (Telegraf/NestJS Gateway)    │
                 └────────────┬─────────────────┘
                              │
                              ▼
      ┌─────────────────────────────┐
      │        API Gateway          │
      │ (NestJS Controllers)        │
      └────────────┬────────────────┘
                   │

┌────────────────┼──────────────────┐
│ │ │
▼ ▼ ▼
User Service Pot Service Bet Service
│ │ │
▼ ▼ ▼
Wallet Service Odds Engine Oracle Service
│ │ │
▼ ▼ ▼
Ledger DB Pot DB Event DB

Polymarket API / Mirror Feed
│
▼
Event Mirror Service ────► stores public polymarket events (source: polymarket)
│
/mirror command in Telegram
│
▼
EventService.cloneEvent(eventId, userId, groupChatId)
│
▼
creates new Event { source: polymarket, visibility: private }
│
▼
PotService.create(eventId, groupChatId, invitedUsers)

Social engagement
People can make “mini Polymarket battles” in their Telegram groups.

🏟️ FIFA Final Pot Created!
Title: Argentina vs Brazil
Odds: 🇦🇷 1.75x | 🇧🇷 2.10x | 🤝 3.50x
Private Pot (Group Only)

Use /joinpot 0.05 🇧🇷 to bet!

👋 You’ve been invited to a private pot:
🏟️ “Will BTC reach $70k by Friday?”

Click to join 👉 /joinpot_abc123
(Joining means you accept prediction risks)

🔥 Trending Markets:

1. Will BTC close above $70k this week?
2. Will Trump win 2028?
3. Will Solana outperform ETH in Q4?

Type /mirror 1 to create a private version.

👋 Create a pot based on a verified public market?

🪙 Market: “Will BTC close above $70k this week?”
✅ Outcome source: Verified Public Market Feed
🔒 Privacy: Private (Group Only)
💰 Entry fee: Custom

/confirm_mirror

🎉 Private Pot Created!
Title: “Will BTC close above $70k?”
Resolution: Verified Source
Join using /joinpot_abc123

cloneEventFromPolymarket() (the backend logic that takes a public mirrored event and turns it into a private group pot)?
