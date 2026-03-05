import { ReactNode } from 'react';
import { TopBar } from '@/components/TopBar/TopBar';
import { BottomNav } from '@/components/BottomNav/BottomNav';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import styles from './Layout.module.scss';

// ============================================
// Component Props
// ============================================

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showTopBar?: boolean;
  showBottomNav?: boolean;
  showNotifications?: boolean;
}

// ============================================
// Layout Component
// ============================================

export const Layout = ({
  children,
  title = 'TechaNewz',
  showTopBar = true,
  showBottomNav = true,
  showNotifications = true,
}: LayoutProps) => {
  return (
    <div className={styles.layout}>
      {/* Desktop Sidebar */}
      <Sidebar />
      
      <div className={styles.content}>
        {showTopBar && <TopBar title={title} showNotifications={showNotifications} />}
        
        <main className={styles.main}>{children}</main>
        
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};
