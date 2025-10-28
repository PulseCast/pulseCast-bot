export const walletDetailsMarkup = async (
  svmAddress?: string,
  balance?: any,
  balanceUSDC?: any,
) => {
  const keyboard: any[] = [];

  if (svmAddress) {
    keyboard.push([
      {
        text: '🔎 View on solscan',
        url: `${process.env.SOLSCAN_SCAN_URL}/address/${svmAddress}`,
      },
    ]);
  }

  keyboard.push(
    [
      {
        text: 'Export wallet',
        callback_data: JSON.stringify({
          command: '/exportWallet',
        }),
      },
      {
        text: 'Reset wallet',
        callback_data: JSON.stringify({
          command: '/resetWallet',
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
  );
  return {
    message: `<b>Your Wallet</b>\n\n
  ${svmAddress ? `<b>Address:</b> <code>${svmAddress}</code>\n\n<b>Balance:</b>\n${balance} SOL\n${balanceUSDC} USDC` : ''}\nTap to copy the address and send tokens to deposit.`,
    keyboard,
  };
};
