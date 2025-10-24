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
