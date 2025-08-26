// hooks/useFarmingTips.ts
export function useFarmingTips() {
  const tips = [
    {
      title: 'Harvest Timing',
      content: 'Harvest cocoa pods when they turn deep yellow or orange. Avoid premature picking.',
    },
    {
      title: 'Fermentation Best Practices',
      content: 'Use wooden boxes or banana leaves. Ferment for 5–7 days, turning beans every 48 hours.',
    },
    {
      title: 'Pest Control',
      content: 'Use neem-based organic sprays and remove infected pods promptly.',
    },
  ];

  return { tips };
}
