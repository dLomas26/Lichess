import React, { useState, useEffect } from 'react';
import { Crown, Trophy, Medal, TrendingUp, Users, Star } from 'lucide-react';
import { lichessApi } from '../services/lichessApi';

const Leaderboard = () => {
  const [selectedVariant, setSelectedVariant] = useState('bullet');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const variants = [
    { key: 'bullet', name: 'Bullet', icon: '⚡' },
    { key: 'blitz', name: 'Blitz', icon: '🏃' },
    { key: 'rapid', name: 'Rapid', icon: '🚶' },
    { key: 'classical', name: 'Classical', icon: '🎯' },
    { key: 'correspondence', name: 'Correspondence', icon: '📮' },
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedVariant]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await lichessApi.getLeaderboard(selectedVariant, 50);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-6 w-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    if (rank <= 10) return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
    return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Crown className="h-10 w-10 mr-3 text-yellow-500" />
            Global Leaderboards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the world's top chess players across different time controls
          </p>
        </div>

        {/* Variant Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 mr-2 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Select Time Control</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {variants.map((variant) => (
              <button
                key={variant.key}
                onClick={() => setSelectedVariant(variant.key)}
                className={`p-4 rounded-lg text-center transition-all duration-200 border-2 ${
                  selectedVariant === variant.key
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">{variant.icon}</div>
                <div className="font-medium">{variant.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Trophy className="h-6 w-6 mr-2" />
              {variants.find(v => v.key === selectedVariant)?.name} Leaderboard
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                const rating = player.perfs[selectedVariant]?.rating || 0;
                const progress = player.perfs[selectedVariant]?.progress || 0;
                
                return (
                  <div
                    key={player.id}
                    className={`p-6 hover:bg-gray-50 transition-all duration-200 ${
                      rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(rank)}`}>
                          {rank <= 3 ? getRankIcon(rank) : <span className="font-bold text-white">#{rank}</span>}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-semibold text-gray-900">{player.username}</h4>
                              {player.title && (
                                <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  {player.title}
                                </span>
                              )}
                              {player.patron && (
                                <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                              )}
                              <div className={`w-2 h-2 rounded-full ${player.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{rating}</div>
                        {progress !== 0 && (
                          <div className={`flex items-center space-x-1 ${
                            progress > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {progress > 0 ? '+' : ''}{progress}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {leaderboard.length === 0 && !loading && (
          <div className="text-center py-12">
            <Crown className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
            <p className="text-gray-500">Unable to load leaderboard for this variant</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;