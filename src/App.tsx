import { Toolbar } from './components/ui/Toolbar';
import { WorkspaceLayout } from './components/ui/WorkspaceLayout';
import './styles/app.css';

function App() {
  return (
    <div className="app">
      <Toolbar />
      <WorkspaceLayout />
    </div>
  );
}

export default App;
