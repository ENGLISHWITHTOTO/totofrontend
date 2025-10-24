import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import VoiceRoomsBrowse from './VoiceRoomsBrowse'
import VoiceRoomPreview from './VoiceRoomPreview'
import VoiceRoomLive from './VoiceRoomLive'
import CreateRoom from './CreateRoom'

export default function VoiceRooms() {
  const location = useLocation()
  const navigate = useNavigate()

  // Redirect to browse page if on root voice-rooms path
  useEffect(() => {
    if (location.pathname === '/speaking/voice-rooms') {
      navigate('/speaking/voice-rooms/browse', { replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <Routes>
      <Route path="browse" element={<VoiceRoomsBrowse />} />
      <Route path="create" element={<CreateRoom />} />
      <Route path=":roomId/preview" element={<VoiceRoomPreview />} />
      <Route path=":roomId/live" element={<VoiceRoomLive />} />
      {/* Fallback route */}
      <Route path="*" element={<VoiceRoomsBrowse />} />
    </Routes>
  )
}