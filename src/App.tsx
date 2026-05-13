import HomePage from './components/HomePage'
import Sidebar from './components/Sidebar'
import Settings from './components/Settings'
import { useAppStore } from './store/appStore'

function App() {
  const { currentView } = useAppStore()

  return (
    <div className="h-full w-full relative overflow-hidden">
      <Sidebar />

      {currentView === 'settings' ? (
        <Settings />
      ) : (
        <HomePage />
      )}
    </div>
  )
}

export default App
