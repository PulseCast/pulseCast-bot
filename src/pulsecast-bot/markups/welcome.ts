export const welcomeMessageMarkup = async (userName: string) => {
  return {
    message: `Hey @${userName} 👋\n\nWelcome to <b>PulseCast</b> ⇢ your social prediction bot!\n\n🎯 Make predictions with your friends on real-world events.\n💰 Create a private prediction pot, invite others, and see who’s right.\n🧾 All results are verified from public, trustworthy data sources.\n\n⚠️<b>PulseCast Disclaimer</b>\nPredictions made here may involve risk, and outcomes depend on publicly verifiable data sources.\nBy continuing, you acknowledge that:\n  ◉You understand prediction outcomes can go either way.\n  ◉You accept full responsibility for any losses or results.\n  ◉You are of legal age and responsible for your own actions.\n  ◉You are participating voluntarily.\n\nPulseCast does not offer financial advice or guaranteed returns.`,
    keyboard: [
      [
        {
          text: '✅ I Understand',
          callback_data: JSON.stringify({
            command: `/acceptDisclaimer`,
          }),
        },
      ],
    ],
  };
};

// Get started 🚀
