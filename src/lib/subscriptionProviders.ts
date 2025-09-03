export type Provider = {
  id: string;
  displayName: string;
  patterns: RegExp[];
  weight: number; // confidence contribution 0..1
  cancelUrl?: string;
  logoEmoji?: string; // simple fallback in lieu of hosted logos
};

const providers: Provider[] = [
  { id: "spotify", displayName: "Spotify", patterns: [/spotify/i], weight: 1, cancelUrl: "https://support.spotify.com/article/cancel-premium/", logoEmoji: "🎵" },
  { id: "netflix", displayName: "Netflix", patterns: [/netflix/i], weight: 1, cancelUrl: "https://www.netflix.com/cancelplan", logoEmoji: "🎬" },
  { id: "youtube-premium", displayName: "YouTube Premium", patterns: [/youtube\s*premium/i], weight: 1, cancelUrl: "https://support.google.com/youtube/answer/6308278", logoEmoji: "▶️" },
  { id: "disney-plus", displayName: "Disney+", patterns: [/disney\+/i], weight: 1, cancelUrl: "https://help.disneyplus.com/csp?id=csp_article_content&sys_kb_id=2a4f5f9c1b7c10105a3aa64b234bcb51", logoEmoji: "🧞" },
  { id: "hbo", displayName: "HBO", patterns: [/hbo|max/i], weight: 0.9, cancelUrl: "https://help.max.com/cancel", logoEmoji: "🎭" },
  { id: "viaplay", displayName: "Viaplay", patterns: [/viaplay/i], weight: 0.9, cancelUrl: "https://viaplay.com/se-se/help/articles/hantera-abonnemang", logoEmoji: "📺" },
  { id: "apple", displayName: "Apple Subscriptions", patterns: [/apple\s*(music|tv|icloud)|itunes|app\s*store/i], weight: 1, cancelUrl: "https://support.apple.com/HT202039", logoEmoji: "🍎" },
  { id: "amazon-prime", displayName: "Amazon Prime", patterns: [/amazon\s*prime/i], weight: 1, cancelUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=G26JQ4XUQ8KVLKCE", logoEmoji: "📦" },
  { id: "audible", displayName: "Audible", patterns: [/audible/i], weight: 0.9, cancelUrl: "https://www.audible.com/help/article/how-can-i-cancel-my-membership", logoEmoji: "🎧" },
  { id: "tidal", displayName: "TIDAL", patterns: [/tidal/i], weight: 0.8, cancelUrl: "https://support.tidal.com/hc/en-us/articles/201281339-Canceling-your-TIDAL-subscription", logoEmoji: "🌊" },
  { id: "deezer", displayName: "Deezer", patterns: [/deezer/i], weight: 0.8, cancelUrl: "https://support.deezer.com/hc/en-gb/articles/115003183369-How-to-cancel-my-subscription", logoEmoji: "🎶" },
  { id: "patreon", displayName: "Patreon", patterns: [/patreon/i], weight: 0.7, cancelUrl: "https://support.patreon.com/hc/en-us/articles/360043055732-How-do-I-cancel-my-membership-", logoEmoji: "🤝" },
  { id: "onlyfans", displayName: "OnlyFans", patterns: [/onlyfans/i], weight: 0.6, cancelUrl: "https://help.onlyfans.com/hc/en-us/articles/115001199294-How-to-cancel-a-subscription", logoEmoji: "⭐" },
  { id: "gym", displayName: "Gym/Fitness", patterns: [/gym|fitness|ifitness|sats|actic/i], weight: 0.6, cancelUrl: undefined, logoEmoji: "💪" },
  { id: "telco-se", displayName: "Swedish Telco", patterns: [/telia|tele2|comviq|tre\b|halebop|telenor/i], weight: 0.8, cancelUrl: undefined, logoEmoji: "📶" },
];

export function matchProvider(name: string): { provider: Provider; score: number } | null {
  if (!name) return null;
  for (const p of providers) {
    if (p.patterns.some((rx) => rx.test(name))) {
      return { provider: p, score: p.weight };
    }
  }
  return null;
}

export function getCancelUrlFor(name: string): string | undefined {
  const m = matchProvider(name);
  return m?.provider.cancelUrl;
}

export function getProviderEmoji(name: string): string | undefined {
  const m = matchProvider(name);
  return m?.provider.logoEmoji;
}


