"use client";
import { useState } from 'react';
import { getAlternatives, trackAffiliateClick, generateAffiliateUrl, AffiliatePartner } from '@/lib/affiliates';
import { ExternalLink, Star, Gift, TrendingDown, Check } from 'lucide-react';

interface AlternativeRecommendationsProps {
  subscriptionName: string;
  currentAmount?: number;
  userId?: string;
}

export default function AlternativeRecommendations({ 
  subscriptionName, 
  currentAmount,
  userId 
}: AlternativeRecommendationsProps) {
  const [showAll, setShowAll] = useState(false);
  const alternatives = getAlternatives(subscriptionName);
  const displayedAlternatives = showAll ? alternatives : alternatives.slice(0, 2);

  const handleAffiliateClick = (partner: AffiliatePartner) => {
    if (userId) {
      trackAffiliateClick(userId, partner.id, subscriptionName);
    }
    
    // Open affiliate link in new tab
    const affiliateUrl = generateAffiliateUrl(partner, userId);
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  if (alternatives.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <TrendingDown className="w-4 h-4 text-green-600" />
        <h4 className="font-medium text-green-800">Better Alternatives Available</h4>
      </div>
      
      <p className="text-sm text-green-700 mb-4">
        Save money by switching to these recommended alternatives:
      </p>

      <div className="space-y-3">
        {displayedAlternatives.map((partner) => (
          <div
            key={partner.id}
            className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg hover:border-green-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{partner.logoEmoji}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h5 className="font-semibold text-gray-900">{partner.name}</h5>
                  {partner.offer && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Gift className="w-3 h-3 mr-1" />
                      {partner.offer}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{partner.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-500">{partner.rating}</span>
                  </div>
                  {partner.savings && (
                    <span className="text-xs text-green-600 font-medium">{partner.savings}</span>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleAffiliateClick(partner)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <span>Try Free</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {alternatives.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          {showAll ? 'Show Less' : `Show ${alternatives.length - 2} More Alternatives`}
        </button>
      )}

      <div className="mt-4 pt-3 border-t border-green-200">
        <div className="flex items-start space-x-2 text-xs text-green-700">
          <Check className="w-3 h-3 mt-0.5 text-green-600" />
          <p>
            <strong>Why switch?</strong> These alternatives offer similar features at better prices or with superior value. 
            Many include free trials so you can test before committing.
          </p>
        </div>
      </div>
    </div>
  );
}
