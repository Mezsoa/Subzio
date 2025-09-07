// Affiliate partners and their commission rates
export interface AffiliatePartner {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl?: string;
  logoEmoji: string;
  affiliateUrl: string;
  commissionRate: number; // percentage
  offer?: string;
  savings?: string;
  rating: number;
  features: string[];
}

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  // Streaming Services
  {
    id: 'apple-music',
    name: 'Apple Music',
    description: 'Stream over 100 million songs ad-free',
    category: 'Music Streaming',
    logoEmoji: '🎵',
    affiliateUrl: 'https://music.apple.com/subscribe?app=music&at=1010l4LB',
    commissionRate: 15,
    offer: '3 months free',
    savings: 'Save vs Spotify',
    rating: 4.5,
    features: ['100M+ songs', 'Lossless audio', 'Spatial audio', 'No ads']
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    description: 'Ad-free YouTube + YouTube Music',
    category: 'Video Streaming',
    logoEmoji: '📺',
    affiliateUrl: 'https://www.youtube.com/premium',
    commissionRate: 20,
    offer: '1 month free',
    savings: '2-in-1 service',
    rating: 4.3,
    features: ['No ads', 'Background play', 'YouTube Music', 'Downloads']
  },
  {
    id: 'hulu',
    name: 'Hulu',
    description: 'Stream TV shows and movies',
    category: 'Video Streaming',
    logoEmoji: '📽️',
    affiliateUrl: 'https://www.hulu.com/welcome',
    commissionRate: 25,
    offer: '30 days free',
    savings: 'Cheaper than Netflix',
    rating: 4.2,
    features: ['Next-day TV', 'Original series', 'Live TV option', 'Ad-free tier']
  },
  
  // Productivity Tools
  {
    id: 'notion',
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, and projects',
    category: 'Productivity',
    logoEmoji: '📝',
    affiliateUrl: 'https://www.notion.so',
    commissionRate: 30,
    offer: 'Free plan available',
    savings: 'Replace multiple tools',
    rating: 4.6,
    features: ['Notes & docs', 'Databases', 'Project management', 'Team collaboration']
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    description: 'Professional design tools made simple',
    category: 'Design',
    logoEmoji: '🎨',
    affiliateUrl: 'https://www.canva.com/pro',
    commissionRate: 35,
    offer: '45 days free',
    savings: 'Cheaper than Adobe',
    rating: 4.7,
    features: ['Premium templates', 'Brand kit', 'Magic resize', 'Team features']
  },
  
  // Financial Tools
  {
    id: 'ynab',
    name: 'YNAB',
    description: 'Budgeting software that works',
    category: 'Finance',
    logoEmoji: '💰',
    affiliateUrl: 'https://www.youneedabudget.com',
    commissionRate: 40,
    offer: '34 days free',
    savings: 'Save more than it costs',
    rating: 4.8,
    features: ['Zero-based budgeting', 'Goal tracking', 'Debt payoff', 'Mobile app']
  },
  
  // VPN Services
  {
    id: 'nordvpn',
    name: 'NordVPN',
    description: 'Secure VPN with global servers',
    category: 'Security',
    logoEmoji: '🔒',
    affiliateUrl: 'https://nordvpn.com',
    commissionRate: 45,
    offer: '68% off 2-year plan',
    savings: 'Better than ExpressVPN',
    rating: 4.4,
    features: ['5400+ servers', 'No-logs policy', 'Double VPN', '24/7 support']
  }
];

export function getAlternatives(subscriptionName: string): AffiliatePartner[] {
  const name = subscriptionName.toLowerCase();
  
  // Music streaming alternatives
  if (name.includes('spotify') || name.includes('music')) {
    return AFFILIATE_PARTNERS.filter(p => p.category === 'Music Streaming');
  }
  
  // Video streaming alternatives
  if (name.includes('netflix') || name.includes('hulu') || name.includes('prime') || name.includes('disney')) {
    return AFFILIATE_PARTNERS.filter(p => p.category === 'Video Streaming');
  }
  
  // Productivity alternatives
  if (name.includes('adobe') || name.includes('office') || name.includes('google workspace')) {
    return AFFILIATE_PARTNERS.filter(p => ['Productivity', 'Design'].includes(p.category));
  }
  
  // VPN alternatives
  if (name.includes('vpn') || name.includes('express') || name.includes('surfshark')) {
    return AFFILIATE_PARTNERS.filter(p => p.category === 'Security');
  }
  
  // Default: return top-rated alternatives
  return AFFILIATE_PARTNERS.slice(0, 3);
}

export function trackAffiliateClick(userId: string | null, partnerId: string, subscriptionName: string) {
  // This will be called when user clicks an affiliate link
  fetch('/api/affiliate/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      partnerId,
      subscriptionName,
    }),
  }).catch(console.error);
}

export function generateAffiliateUrl(partner: AffiliatePartner, userId?: string): string {
  // Add tracking parameters to affiliate URL
  const url = new URL(partner.affiliateUrl);
  if (userId) {
    url.searchParams.set('ref', `killsub_${userId}`);
  }
  url.searchParams.set('source', 'killsub');
  return url.toString();
}
