import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './app/css/startupProfile.css'
import App from './app/App'
import { WebDataProvider } from './app/contexts/webData'
import { AuthProvider } from './app/contexts/authContext'
import { UserDataProvider } from './app/contexts/userDataContext'
import { StartupProvider } from './app/contexts/StartupProfileContext'
import { MentorshipDataProvider } from './app/contexts/mentorshipContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebDataProvider>
      <AuthProvider>
        <UserDataProvider>
          <StartupProvider>
            <MentorshipDataProvider>
              <App />
            </MentorshipDataProvider>
          </StartupProvider>
        </UserDataProvider>
      </AuthProvider>
    </WebDataProvider>
  </StrictMode>
)
