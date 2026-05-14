import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AppLayout } from './components/AppLayout'
import { ConnectionsPage } from './pages/ConnectionsPage'
import { ContactsPage } from './pages/ContactsPage'
import { MessagesPage } from './pages/MessagePage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'
import { AuthLayout } from './components/AuthLayout'

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
      </Route>

      <Route element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route path='/' element={<Navigate to='/connections' replace />} />
        <Route path='/connections' element={<ConnectionsPage />} />
        <Route path='/connections/:connectionId/contacts' element={<ContactsPage />} />
        <Route path='/connections/:connectionId/messages' element={<MessagesPage />} />

      </Route>
    </Routes>
  )
}

export default App
