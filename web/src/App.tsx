import { Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AppLayout } from './components/AppLayout'
import { ConnectionsPage } from './pages/ConnectionsPage'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route path='/' element={<ConnectionsPage />} />
        <Route path='/connections' element={<ConnectionsPage />} />
        <Route path='/connections/:connectionId/contacts' element={<div>Connection Contacts</div>} />
        <Route path='/connections/:connectionId/messages' element={<div>Connection Messages</div>} />

      </Route>
    </Routes>
  )
}

export default App
