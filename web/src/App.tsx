import { Outlet, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route element={<PrivateRoute><Outlet /></PrivateRoute>}>
        <Route path='/' element={<div>Home</div>} />
        <Route path='/connections' element={<div>Connections</div>} />
        <Route path='/connections/:connectionId/contacts' element={<div>Connection Contacts</div>} />
        <Route path='/connections/:connectionId/messages' element={<div>Connection Messages</div>} />

      </Route>
    </Routes>
  )
}

export default App
