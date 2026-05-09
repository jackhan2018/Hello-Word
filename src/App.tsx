import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Novels } from './pages/Novels';
import { NovelWorkspace } from './pages/NovelWorkspace';
import { WritingEditor } from './pages/WritingEditor';
import { Characters } from './pages/Characters';
import { WorldEditor } from './pages/WorldEditor';
import { Timeline } from './pages/Timeline';
import { Publish } from './pages/Publish';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/novels" element={<Novels />} />
          <Route path="/novels/:id" element={<NovelWorkspace />} />
          <Route path="/novels/:id/chapter/:chapterId" element={<WritingEditor />} />
          <Route path="/novels/:id/characters" element={<Characters />} />
          <Route path="/novels/:id/world" element={<WorldEditor />} />
          <Route path="/novels/:id/timeline" element={<Timeline />} />
          <Route path="/novels/:id/publish" element={<Publish />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/world" element={<WorldEditor />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
