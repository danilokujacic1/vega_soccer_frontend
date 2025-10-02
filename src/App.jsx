import { useEffect, useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [isMatchesLoading, setIsMatchesLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [loginState, setLoginState] = useState({
    username: '',
    password: ''
  })
  const [matchState, setMatchState] = useState({
    first_player: '',
    first_player_score: '',
    second_player: '',
    second_player_score: ''
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPlayersLoading, setIsPlayersLoading] = useState(true);

  useEffect(() => {

    setIsPlayersLoading(true);
    setIsMatchesLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/logged-in`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => res.json()).then(data => {
     setIsLoggedIn(data.loggedIn)
    })
    fetch(`${import.meta.env.VITE_API_URL}/matches`).then(res => res.json()).then(data => {
      setIsMatchesLoading(false)
      setMatches(data.matches)
    })
    fetch(`${import.meta.env.VITE_API_URL}/players`).then(res => res.json()).then(data => {
      setIsPlayersLoading(false)
      setPlayers(data.players)
    })
  }, [setIsMatchesLoading, setMatches, setPlayers, setIsPlayersLoading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Head-to-Head Match Tracker
        </h1>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-lg shadow-md">
          {!isLoggedIn ? <button onClick={() => {
            setActiveTab('login')
          }} className="my-4 mx-auto block pointer rounded-sm bg-indigo-600 text-white px-4 py-2">Login</button> : <div className="flex gap-3 flex-col py-4 px-2">
          <select onChange={event => {
                setMatchState(prev => ({ ...prev, first_player: event.target.value }));
              }} className='py-2 px-4 rounded-sm border-gray-100 border-2 max-w-96' placeholder='Username' >
                {players.map(player => <option key={player.id} value={player.name}>{ player.name}</option>) }


              </select>
                <input onChange={event => {
                setMatchState(prev => ({ ...prev, first_player_score: event.target.value }));
              }} className='py-2 px-4 rounded-sm border-gray-100 border-2 max-w-96' placeholder='First player score'></input>
               <select onChange={event => {
                setMatchState(prev => ({ ...prev, second_player: event.target.value }));
              }} className='py-2 px-4 rounded-sm border-gray-100 border-2 max-w-96' placeholder='Username' >
                {players.map(player => <option key={player.id} value={player.name}>{ player.name}</option>) }


              </select>
                 <input onChange={event => {
                setMatchState(prev => ({ ...prev, second_player_score: event.target.value }));
              }} className='py-2 px-4 rounded-sm border-gray-100 border-2 max-w-96' placeholder='Second Player Score'></input>
              <button onClick={() => {
                fetch(`${import.meta.env.VITE_API_URL}/log-match`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify(matchState)
                }).then(res => res.json()).then(() => {
                  setMatchState({
    first_player: '',
    first_player_score: '',
    second_player: '',
    second_player_score: ''
                  })
                  window.location.reload()
                })
          }} className="my-4 mx-auto block pointer rounded-sm bg-indigo-600 text-white px-4 py-2">Log</button>
          </div>}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex-1 px-4 py-4 md:px-6 text-md md:text-lg font-semibold transition-colors ${
                activeTab === 'matches'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Match History
            </button>
            <button
              onClick={() => setActiveTab('victories')}
              className={`flex-1 px-4 py-4 md:px-6 text-md md:text-lg font-semibold transition-colors ${
                activeTab === 'victories'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Victories
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-md p-2 md:p-6">
          {activeTab === 'matches' ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Matches</h2>
              <div className="space-y-4">
                {isMatchesLoading ? <p className="text-2xl font-semibold text-center py-4">Loading...</p> : !matches.length ? <p className="text-2xl font-semibold text-center py-4">No matches</p> : matches.map(match => (
                  <div
                    key={match.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3 mb-2">
                          <span className={`font-semibold text-lg ${match.winner === match.player1 ? 'text-green-600' : 'text-gray-700'}`}>
                            {match.first_player_name}
                          </span>
                          <span className="text-gray-400">vs</span>
                          <span className={`font-semibold text-lg ${match.winner === match.player2 ? 'text-green-600' : 'text-gray-700'}`}>
                            {match.second_player_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(match.match_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-indigo-600 mb-1">
                          {match.first_player_score} - {match.second_player_score}
                        </div>
                        <div className="text-xs text-gray-500">Final Score</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Winner:  </span>
                      <span className="text-sm font-semibold text-green-600">{match.first_player_score > match.second_player_score ? match.first_player_name : match.first_player_score < match.second_player_score ? match.second_player_name : 'Draw'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'login' ? <div className="py-4 flex flex-col gap-2 px-4">
              <input onChange={event => {
                setLoginState(prev => ({ ...prev, username: event.target.value }));
              }} className='py-2 px-4 rounded-sm border-gray-100 border-2 max-w-96' placeholder='Username' />
                <input onChange={event => {
                setLoginState(prev => ({ ...prev, password: event.target.value }));
              }} className='py-2 px-4 rounded-sm border-gray-100 border-2 max-w-96' placeholder='Password' type='password'></input>
              <button onClick={
                () => {
                fetch(`${import.meta.env.VITE_API_URL}/login`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(loginState),
                }
                ).then(res => res.json()).then(data => {
                  setLoginState({ username: '', password: '' });
                  
                  localStorage.setItem('token', data.token);
                  window.location.reload()

                })
            
          }} className="my-4 mx-auto block pointer rounded-sm bg-indigo-600 text-white px-4 py-2">Login</button>
            </div> : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Victory Leaderboard</h2>
              <div className="space-y-3">
                {isPlayersLoading ? <p className="text-2xl font-semibold text-center py-4">Loading...</p>  : !players.length ? <p className="text-2xl font-semibold text-center py-4">No players</p>  :  players.map((stat, index) => (
                  <div
                    key={stat.player}
                    className="flex items-center gap-4 p-5 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className={`flex-shrink-0 h-6 w-6 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-indigo-100 text-indigo-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-md md:text-lg text-gray-800">{stat.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg md:text-3xl font-bold text-indigo-600">{stat.victories}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;