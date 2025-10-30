# PulseCast – Community Prediction Trading Bot (Solana)

PulseCast is a **community-powered prediction trading bot** on **Telegram**, enabling users to stake on match outcomes, trade positions in-play, and compete for pot winnings — all **on-chain using Solana**.

Instead of betting against bookmakers, users **trade against each other**, with dynamic market prices driven by real-time demand.

---

## 🚀 Core Idea

Fans don’t just want to bet — **they want rivalry, banter, and bragging rights.**

PulseCast turns sports matches into **interactive prediction markets**, where community sentiment moves the price.

---

## 🧩 How It Works

1. **A match market opens** with outcomes:
   - Home Win
   - Draw
   - Away Win

2. Users **stake SPL tokens (e.g., USDC)** and receive **shares**.

3. **Share prices move** as others buy/sell positions.

4. Users may **cashout anytime before match settlement**.

5. When the match ends:
   - Winners are paid based on **their share ownership**.
   - A small **protocol fee** is taken.

---

## ✨ Features

| Feature                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| Group Prediction Pools | Works inside Telegram group chats or private DM. |
| In-Play Trading        | Share prices shift dynamically during the match. |
| SPL Token Support      | Uses Solana SPL tokens (e.g., USDC).             |
| Secure Wallet Handling | User wallets are encrypted and isolated.         |
| Automatic Settlement   | Winners get paid instantly when the match ends.  |
| Optional Private Pools | Group admins can run their own markets.          |

---

## 🏗 Architecture

- **Blockchain:** Solana
- **Backend:** NestJS + TypeScript
- **Database:** MongoDB
- **Wallet & Token Ops:** Solana Web3 + SPL-token
- **Bot UI:** Telegram Bot API

---

## 📦 Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Language   | TypeScript                         |
| Framework  | NestJS                             |
| Database   | MongoDB                            |
| Blockchain | Solana Web3.js + SPL Token Program |
| Bot        | Telegram Bot API                   |
| Deployment | PM2                                |

---

## 🛣 Roadmap

| Stage     | Feature                                        |
| --------- | ---------------------------------------------- |
| ✅ MVP    | Group pools, in-play trading, cashout          |
| 🔄 Next   | Leaderboards, referral rewards                 |
| 🔜 Future | Live match visualization, DAO-governed markets |

---
