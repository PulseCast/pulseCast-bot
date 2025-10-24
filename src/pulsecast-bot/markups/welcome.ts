export const welcomeMessageMarkup = async (userName: string) => {
  return {
    message: `Hey @${userName} 👋\n\nWelcome to <b>PulseCast</b> — your social prediction bot!\n\n🎯 🎯 Make predictions with your friends on real-world events.\n💰 Create a private prediction pot, invite others, and see who’s right.\n🧾 All results are verified from public, trustworthy data sources.\n\n⚠️<b>PulseCast Disclaimer</b>\nPredictions made here may involve risk, and outcomes depend on publicly verifiable data sources.\nBy continuing, you acknowledge that:\n  ☞You understand prediction outcomes can go either way.\n  ☞You accept full responsibility for any losses or results.\n  ☞You are participating voluntarily.`,
    keyboard: [
      [
        {
          text: '✅ I Understand',
          callback_data: JSON.stringify({
            command: `/acceptDisclaimer`,
          }),
        },
      ],
      // [
      //   {
      //     text: '➕ Add to Group',
      //     url: `${process.env.BOT_URL}?startgroup=true`,
      //   },
      // ],
    ],
  };
};

// Get started 🚀
