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
    <div className="min-h-screen w-full bg-white text-gray-900 font-sans">
      {token ? (
        <Dashboard token={token} onSignOut={signOut} />
      ) : view === 'sign-in' ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-sm p-8 rounded-xl shadow bg-white">
            <SignIn onAuth={handleAuth} />
            <div className="text-center mt-4">
              <button onClick={() => setView('sign-up')} className="text-sm text-blue-600 hover:underline">Create account</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-sm p-8 rounded-xl shadow bg-white">
            <SignUp onAuth={handleAuth} />
            <div className="text-center mt-4">
              <button onClick={() => setView('sign-in')} className="text-sm text-blue-600 hover:underline">Already have an account?</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
