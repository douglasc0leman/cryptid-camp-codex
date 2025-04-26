export const cabinColorMap: Record<string, { bg: string; text: string }> = {
    obsidian: { bg: '#1a1a1a', text: 'text-white' },
    quartz: {
      bg: `linear-gradient(
        45deg,
        hsl(0, 100%, 90%) 0%,
        hsl(36, 100%, 90%) 10%,
        hsl(64, 74%, 90%) 20%,
        hsl(118, 68%, 90%) 30%,
        hsl(179, 68%, 90%) 40%,
        hsl(188, 76%, 90%) 50%,
        hsl(212, 86%, 90%) 60%,
        hsl(260, 89%, 90%) 70%,
        hsl(284, 94%, 90%) 80%,
        hsl(308, 97%, 90%) 90%,
        hsl(0, 100%, 90%) 100%
      )`,
      text: 'text-gray-900',
    },
    corallium: { bg: '#8b0000', text: 'text-white' },
    lapis: { bg: '#00377b', text: 'text-white' },
    meteorite: { bg: '#8dc63f', text: 'text-gray-900' },
    fluorite: { bg: '#955ea5', text: 'text-white' },
    malachite: { bg: '#1a5428', text: 'text-white' },
    fulgurite: { bg: '#abe1fa', text: 'text-gray-900' },
    gem: { bg: '#ffcb05', text: 'text-gray-900' },
  }