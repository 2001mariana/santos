import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SaintDetails } from './components/SaintDetails'
import { SaintsPage } from './components/SaintsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SaintsPage />} />
        <Route path="/saints" element={<SaintsPage />} />
        <Route path="/saints/:saintId" element={<SaintDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
