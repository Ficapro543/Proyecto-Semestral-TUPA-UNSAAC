import { Outlet } from 'react-router-dom';
import PublicTopbar from './PublicTopbar';
import SharedFooter from './SharedFooter';

export default function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--clr-background)' }}>
      <PublicTopbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <SharedFooter />
    </div>
  );
}
