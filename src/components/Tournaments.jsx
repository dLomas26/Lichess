import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, Users, Target, Award, Zap, Filter } from 'lucide-react';
import { lichessApi } from '../services/lichessApi';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('starting');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const data = await lichessApi.getArenatournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeControl = (clock) => {
    const minutes = Math.floor(clock.limit / 60);
    const seconds = clock.limit % 60;
    const timeStr = seconds > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${minutes}`;
    return `${timeStr} + ${clock.increment}"`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 10: return 'bg-green-500'; // Created/Starting
      case 20: return 'bg-blue-500'; // Started
      case 30: return 'bg-gray-500'; // Finished
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 10: return 'Starting Soon';
      case 20: return 'In Progress';
      case 30: return 'Finished';
      default: return 'Unknown';
    }
  };

  const getVariantIcon = (variant) => {
    switch (variant.toLowerCase()) {
      case 'bullet': return '⚡';
      case 'blitz': return '🏃';
      case 'rapid': return '🚶';
      case 'classical': return '🎯';
      default: return '♟️';
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === 'starting') return tournament.status === 10;
    if (filter === 'finished') return tournament.status === 30;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Trophy className="h-10 w-10 mr-3 text-orange-500" />
            Chess Tournaments
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join competitive arena tournaments and test your skills against players worldwide
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filter Tournaments</h3>
            </div>
            <button
              onClick={fetchTournaments}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { key: 'starting', label: 'Starting Soon', count: tournaments.filter(t => t.status === 10).length },
              { key: 'all', label: 'All Tournaments', count: tournaments.length },
              { key: 'finished', label: 'Recently Finished', count: tournaments.filter(t => t.status === 30).length }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                  filter === filterOption.key
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{filterOption.label}</div>
                <div className="text-sm text-gray-500 mt-1">{filterOption.count} tournaments</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tournaments Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Tournament Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 relative">
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(tournament.status)}`} />
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getVariantIcon(tournament.variant.key)}</span>
                    <h3 className="text-lg font-semibold text-white truncate">
                      {tournament.fullName}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-300 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tournament.status)} text-white`}>
                      {getStatusText(tournament.status)}
                    </span>
                    <span className="capitalize">{tournament.variant.name}</span>
                  </div>
                </div>

                {/* Tournament Details */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatTimeControl(tournament.clock)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {tournament.nbPlayers} players
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Starts: {formatDateTime(tournament.startsAt)}
                      </span>
                    </div>
                    {tournament.finishesAt && (
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Ends: {formatDateTime(tournament.finishesAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Award className={`h-4 w-4 ${tournament.rated ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${tournament.rated ? 'text-green-600' : 'text-gray-600'}`}>
                        {tournament.rated ? 'Rated' : 'Unrated'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {tournament.minutes}min
                      </div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                  </div>

                  {tournament.maxRating && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800 font-medium">
                          Max Rating: {tournament.maxRating.rating}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTournaments.length === 0 && !loading && (
          <div className="text-center py-12">
            <Trophy className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tournaments Found</h3>
            <p className="text-gray-500">No tournaments match your current filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;