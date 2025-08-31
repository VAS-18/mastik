import { useState } from 'react'
import './App.css'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [view, setView] = useState<'sign-in' | 'sign-up' | 'dashboard'>('sign-in')

  function handleAuth(tkn: string) {
    setToken(tkn)
    setView('dashboard')
    // persist simple token
    localStorage.setItem('token', tkn)
  }

  function signOut() {
    setToken(null)
    localStorage.removeItem('token')
    setView('sign-in')
  }

  // try restore
  if (!token) {
    const stored = localStorage.getItem('token')
    if (stored) {
      setToken(stored)
      setView('dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-3xl mx-auto">
        {token ? (
          <Dashboard token={token} onSignOut={signOut} />
        ) : view === 'sign-in' ? (
          <div>
            <SignIn onAuth={handleAuth} />
            <div className="text-center mt-3">
              <button onClick={() => setView('sign-up')} className="text-sm text-blue-600">Create account</button>
            </div>
          </div>
        ) : (
          <div>
            <SignUp onAuth={handleAuth} />
            <div className="text-center mt-3">
              <button onClick={() => setView('sign-in')} className="text-sm text-blue-600">Already have an account?</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
