import { useState, useEffect } from 'react'
import './App.css'

const videos = [
  { id: 1, title: 'Beyond the Universe', category: 'SCIENCE', duration: '12 MIN', emoji: '🌌', description: 'Explore distant galaxies, black holes, and the mysteries of our universe.', color: 'space' },
  { id: 2, title: 'The Future of AI', category: 'TECHNOLOGY', duration: '08 MIN', emoji: '🤖', description: 'Discover how artificial intelligence is changing the world.', color: 'ai' },
  { id: 3, title: 'Inside the Human Brain', category: 'DISCOVERY', duration: '15 MIN', emoji: '🧠', description: 'Journey through the most fascinating organ in the human body.', color: 'brain' },
  { id: 4, title: 'Ocean Unknown', category: 'NATURE', duration: '10 MIN', emoji: '🌊', description: 'Explore the hidden world beneath the ocean.', color: 'ocean' },
  { id: 5, title: 'The Quantum World', category: 'SCIENCE', duration: '11 MIN', emoji: '⚛️', description: 'Discover the strange rules governing the smallest particles.', color: 'quantum' },
  { id: 6, title: 'Future of Robotics', category: 'TECHNOLOGY', duration: '09 MIN', emoji: '🦾', description: 'Meet the machines transforming industries and everyday life.', color: 'robot' },
]

function App() {
  const [activeTab, setActiveTab] = useState('Home')
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [mood, setMood] = useState('Curious')
  const [saved, setSaved] = useState<number[]>([])
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)

  // Basic keyboard navigation for a TV-style interface
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setSelected(n => Math.min(n + 1, videos.length - 1))
      }

      if (event.key === 'ArrowLeft') {
        setSelected(n => Math.max(n - 1, 0))
      }

      if (event.key === 'Escape') {
        setActiveTab('Home')
        setAnswer('')
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Connect the Ask Vision interface to the local Gemini backend
  const askAI = async () => {
    const question = query.trim()

    if (!question || loading) return

    setLoading(true)
    setAnswer('Vision is thinking...')

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'The AI request failed.')
      }

      setAnswer(data.answer || 'Vision could not generate an answer. Please try again.')
    } catch (error) {
      console.error('VisionTV AI error:', error)

      setAnswer(
        'Could not connect to Vision AI. Make sure the backend is running on port 3001 and the Vite proxy is configured correctly.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Voice search using browser speech recognition
  const startVoice = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setAnswer(
        'Voice recognition is not supported in this browser. Try Chrome and allow microphone access.'
      )
      return
    }

    const recognition = new SpeechRecognitionAPI()

    recognition.lang = 'en-US'
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript
      setQuery(spoken)
      setAnswer(`I heard: "${spoken}". Press ASK VISION to get an AI response.`)
    }

    recognition.onerror = () => {
      setListening(false)
      setAnswer('Microphone access failed. Check your browser permissions.')
    }

    recognition.start()
  }

  const recommendations =
    activeTab === 'Mood Studio'
      ? videos.filter(video =>
          mood === 'Relax'
            ? ['ocean', 'space'].includes(video.color)
            : mood === 'Learn'
              ? ['ai', 'brain', 'quantum'].includes(video.color)
              : true
        )
      : videos

  return (
    <div className="tv-app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">✳</span>
          <span>
            VISION<span className="brand-light">TV</span>
            <small> INTELLIGENCE, REIMAGINED</small>
          </span>
        </div>

        <div className="top-status">
          <span className="status-dot"></span>
          AI SYSTEM ONLINE <span className="top-divider">|</span> GEMINI AI
        </div>

        <div className="profile">
          P<span>VIEWER</span>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <p className="menu-label">YOUR EXPERIENCE</p>

          {[
            ['⌂', 'Home'],
            ['⌕', 'Discover'],
            ['✧', 'AI Companion'],
            ['◉', 'Mood Studio'],
            ['♡', 'My Space'],
          ].map(([icon, tab]) => (
            <button
              key={tab}
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="nav-icon">{icon}</span>
              {tab}
              {tab === 'AI Companion' && (
                <span className="nav-badge">AI</span>
              )}
            </button>
          ))}

          <div className="sidebar-bottom">
            <div className="orb">✳</div>
            <strong>Your TV. Your intelligence.</strong>
            <p>A new way to experience every screen.</p>
            <span>VISION OS · CONCEPT 01</span>
          </div>
        </aside>

        <main className="main-content">
          <div className="welcome">
            <div>
              <span className="eyebrow">YOUR PERSONAL INTELLIGENCE</span>
              <h1>
                Entertainment,<br />
                <span>evolved.</span>
              </h1>
              <p>Discover something extraordinary. Just ask.</p>
            </div>

            <div className="hero-orb">
              <div className="orb-ring ring-one"></div>
              <div className="orb-ring ring-two"></div>
              <div className="orb-core">✳</div>
              <span className="orb-caption">VISION AI</span>
            </div>
          </div>

          <section className="ask-panel">
            <div className="ask-heading">
              <span className="sparkle">✧</span>
              <div>
                <strong>Ask Vision</strong>
                <p>Your curiosity is the remote.</p>
              </div>
              <span className="powered">GEMINI AI DISCOVERY</span>
            </div>

            <form
              className="search-row"
              onSubmit={event => {
                event.preventDefault()
                void askAI()
              }}
            >
              <span className="search-icon">⌕</span>

              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Ask about movies, science, or technology..."
                aria-label="Ask Vision a question"
              />

              <button
                type="button"
                className={`voice-button ${listening ? 'listening' : ''}`}
                onClick={startVoice}
              >
                {listening ? '● LISTENING' : '🎙 VOICE'}
              </button>

              <button
                className="ask-button"
                type="submit"
                disabled={loading || !query.trim()}
              >
                {loading ? 'THINKING...' : 'ASK VISION ↗'}
              </button>
            </form>

            {answer && (
              <div className="ai-answer" aria-live="polite">
                <span>✧ VISION AI</span>
                <p>{answer}</p>
                <button
                  onClick={() => {
                    setActiveTab('Discover')
                    setAnswer('')
                  }}
                >
                  EXPLORE CONTENT →
                </button>
              </div>
            )}

            <div className="suggestions">
              <span>TRY ASKING</span>

              {[
                'Recommend a sci-fi movie',
                'Something relaxing',
                'Explain artificial intelligence',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion)
                    setAnswer('')
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>

          {activeTab === 'Mood Studio' && (
            <section className="mood-panel">
              <span className="eyebrow">TUNE INTO YOUR MOMENT</span>
              <h2>What are you in the mood for?</h2>

              <div className="mood-options">
                {['Curious', 'Relax', 'Learn'].map(item => (
                  <button
                    className={mood === item ? 'mood-selected' : ''}
                    key={item}
                    onClick={() => setMood(item)}
                  >
                    {item === 'Curious'
                      ? '✨'
                      : item === 'Relax'
                        ? '🌊'
                        : '🧠'}{' '}
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'AI Companion' && (
            <section className="companion-panel">
              <span className="eyebrow">YOUR PERSONAL AI COMPANION</span>
              <h2>Curiosity has no limits.</h2>
              <p>
                Ask Vision anything using the question box above. Gemini will
                generate a response for you.
              </p>
            </section>
          )}

          {activeTab === 'My Space' && (
            <section className="companion-panel">
              <span className="eyebrow">YOUR COLLECTION</span>
              <h2>Saved for later.</h2>
              <p>
                {saved.length
                  ? `${saved.length} title${saved.length === 1 ? '' : 's'} saved to your collection.`
                  : 'Save a title using the bookmark button on any content card.'}
              </p>
            </section>
          )}

          <section className="content-section">
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  {activeTab === 'Discover'
                    ? 'EXPLORE THE CATALOGUE'
                    : activeTab === 'Mood Studio'
                      ? 'SELECTED FOR YOUR MOOD'
                      : activeTab === 'My Space'
                        ? 'YOUR SAVED CONTENT'
                        : 'HANDPICKED FOR YOUR CURIOSITY'}
                </span>

                <h2>
                  {activeTab === 'Discover'
                    ? 'Discover something new'
                    : activeTab === 'AI Companion'
                      ? 'Explore & ask'
                      : activeTab === 'Mood Studio'
                        ? 'Made for this moment'
                        : activeTab === 'My Space'
                          ? 'Your saved titles'
                          : 'Featured experiences'}{' '}
                  <span>↗</span>
                </h2>
              </div>

              <span className="view-all">
                {recommendations.length} EXPERIENCES
              </span>
            </div>

            <div className="video-grid">
              {recommendations
                .filter(
                  video =>
                    activeTab !== 'My Space' || saved.includes(video.id)
                )
                .map(video => (
                  <article
                    className={`video-card ${selected === video.id - 1 ? 'focused' : ''}`}
                    key={video.id}
                    onClick={() => {
                      setSelected(video.id - 1)
                      setQuery(`Tell me more about ${video.title}`)
                      setAnswer(
                        `${video.title}: ${video.description} Ask Vision for more details.`
                      )
                    }}
                  >
                    <div className={`video-art ${video.color}`}>
                      <span className="art-emoji">{video.emoji}</span>
                      <span className="art-category">{video.category}</span>
                      <span className="play-icon">▶</span>
                      <span className="duration">{video.duration}</span>
                    </div>

                    <div className="card-info">
                      <div>
                        <h3>{video.title}</h3>
                        <p>{video.description}</p>
                      </div>

                      <button
                        className={`save-button ${saved.includes(video.id) ? 'is-saved' : ''}`}
                        aria-label={`Save ${video.title}`}
                        onClick={event => {
                          event.stopPropagation()

                          setSaved(old =>
                            old.includes(video.id)
                              ? old.filter(id => id !== video.id)
                              : [...old, video.id]
                          )
                        }}
                      >
                        {saved.includes(video.id) ? '♥' : '♡'}
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </section>

          <footer>
            <span>VISIONTV AI © 2026</span>
            <span>BUILT FOR THE FUTURE OF TELEVISION</span>
            <span>CONCEPT EXPERIENCE · DEMO CATALOGUE</span>
          </footer>
        </main>
      </div>
    </div>
  )
}


export default App