import React, { useState } from 'react';
import { Search, User, Globe, Calendar, Clock, Trophy, Target, TrendingUp, Award } from 'lucide-react';
import { lichessApi } from '../services/lichessApi';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const userData = await lichessApi.getUser(username.trim());
      setUser(userData);
    } catch (err) {
      setError('User not found or API error occurred');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPlayTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hours`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Player Profile Lookup
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for any Lichess player to view their detailed profile, ratings, and statistics
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Lichess username..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {user && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
                    {user.title && (
                      <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {user.title}
                      </span>
                    )}
                    <div className={`w-3 h-3 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  {user.profile?.bio && (
                    <p className="text-gray-600 mb-4">{user.profile.bio}</p>
                  )}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    {user.profile?.country && (
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{user.profile.country}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatPlayTime(user.playTime.total)} played</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings Grid */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-orange-500" />
                Ratings & Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(user.perfs)
                  .filter(([_, perf]) => perf.games > 0)
                  .sort(([_, a], [__, b]) => b.rating - a.rating)
                  .map(([variant, perf]) => (
                    <div
                      key={variant}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {variant.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4 text-orange-500" />
                          <span className="text-2xl font-bold text-gray-900">{perf.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Games:</span>
                          <span className="font-medium">{perf.games}</span>
                        </div>
                        {perf.prog !== 0 && (
                          <div className="flex justify-between items-center">
                            <span>Progress:</span>
                            <div className={`flex items-center space-x-1 ${
                              perf.prog > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-medium">{perf.prog > 0 ? '+' : ''}{perf.prog}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Game Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="h-6 w-6 mr-2 text-orange-500" />
                Game Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-700 mb-1">{user.count.win}</div>
                  <div className="text-sm text-green-600 font-medium">Wins</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-700 mb-1">{user.count.loss}</div>
                  <div className="text-sm text-red-600 font-medium">Losses</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-700 mb-1">{user.count.draw}</div>
                  <div className="text-sm text-yellow-600 font-medium">Draws</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700 mb-1">{user.count.all}</div>
                  <div className="text-sm text-blue-600 font-medium">Total Games</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!user && !loading && !error && (
          <div className="text-center py-12">
            <User className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Profile Selected</h3>
            <p className="text-gray-500">Enter a Lichess username above to view their profile</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;