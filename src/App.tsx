import { Toolbar } from './components/ui/Toolbar';
import { WorkspaceLayout } from './components/ui/WorkspaceLayout';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './styles/app.css';

function App() {
  useKeyboardShortcuts();

  return (
    <div className="app">
      <Toolbar />
      <WorkspaceLayout />
    </div>
  );
}

export default App;
