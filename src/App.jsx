import { useState } from 'react'
import './App.css'

const tracks = [
  {
    id: 1,
    title: 'Midnight Melody',
    artist: 'Luna Vale',
    genre: 'Synth pop',
    mood: 'Late night',
    duration: '3:42',
    color: 'cyan',
    startVotes: 12,
  },
  {
    id: 2,
    title: 'Vibu Material',
    artist: 'Nova Arcade',
    genre: 'Electro rock',
    mood: 'High energy',
    duration: '4:08',
    color: 'baby pink',
    startVotes: 9,
  },
]

function TrackCard({ track, votes, isLeader, justVoted, onVote }) {
  return (
    <article
      className={`track-card ${track.color} ${isLeader ? 'winner' : ''} ${
        justVoted ? 'pulse' : ''
      }`}
    >
      {isLeader && <div className="crown-badge">Crown Leader</div>}

      <p className="genre">{track.genre}</p>
      <h2>{track.title}</h2>
      <p className="artist">{track.artist}</p>
      <p className="mood">Mood: {track.mood}</p>
      <p className="duration">Duration: {track.duration}</p>

      <button type="button" onClick={() => onVote(track.id)}>
        Vote for {track.title}
      </button>

      <p className="votes">{votes} votes</p>
    </article>
  )
}

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [votes, setVotes] = useState(
    tracks.reduce((result, track) => {
      return { ...result, [track.id]: track.startVotes }
    }, {}),
  )
  const [lastVotedId, setLastVotedId] = useState(null)

  const totalVotes = tracks.reduce((sum, track) => sum + votes[track.id], 0)
  const leader = tracks.reduce((topTrack, track) => {
    return votes[track.id] > votes[topTrack.id] ? track : topTrack
  }, tracks[0])
  const isTie = votes[tracks[0].id] === votes[tracks[1].id]

  function handleVote(trackId) {
    setVotes({
      ...votes,
      [trackId]: votes[trackId] + 1,
    })
    setLastVotedId(trackId)
  }

  return (
    <main className={`app-shell ${isDarkTheme ? 'dark-theme' : ''}`}>
      <button
        className="theme-toggle"
        type="button"
        onClick={() => setIsDarkTheme(!isDarkTheme)}
      >
        {isDarkTheme ? 'Light theme' : 'Dark theme'}
      </button>

      <section className="hero-panel">
        <p className="eyebrow">Live concert hall vote</p>
        <h1>Playlist Duel</h1>
        <p>
          Pick the track that should own the next spotlight. The vote bar and
          leader badge update as soon as you click.
        </p>
      </section>

      <p className="battle-name">Round 1: Neon Night Showdown</p>
      <section className="duel-stage" aria-label="Track voting cards">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            votes={votes[track.id]}
            isLeader={!isTie && leader.id === track.id}
            justVoted={lastVotedId === track.id}
            onVote={handleVote}
          />
        ))}
      </section>

      <section className="vote-board" aria-label="Live vote results">
        <div className="leader-strip">
          <span className="live-dot"></span>
          {isTie ? 'Tie game. One vote can change the stage.' : `${leader.title} is leading`}
        </div>

        <p className="total-votes">Total votes: {totalVotes}</p>

        <div className="vote-bar">
          {tracks.map((track) => {
            const percent = Math.round((votes[track.id] / totalVotes) * 100)

            return (
              <div
                className={`vote-segment ${track.color}`}
                key={track.id}
                style={{ width: `${percent}%` }}
              >
                {percent}%
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default App
