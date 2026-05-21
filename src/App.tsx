import React from 'react';
import { BaliNeraProvider, useBaliNera } from './context/BaliNeraContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthGateway from './components/AuthGateway';
import UserExplorer from './components/UserExplorer';
import AdminPanel from './components/AdminPanel';

function BaliNeraInteriorApp() {
  const { currentUser } = useBaliNera();

  // Scroll to targeted section for standard layout navigation
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // If no user is authenticated, the system locks state to the Initial Auth Gateway (Login/Register)
  if (!currentUser) {
    return <AuthGateway />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Shared Responsive Header */}
      <Navbar onScrollToSection={handleScrollToSection} />

      {/* Main Board Routing */}
      <div className="flex-1 animate-fade-in">
        {currentUser.role === 'admin' ? (
          <AdminPanel />
        ) : (
          <UserExplorer />
        )}
      </div>

      {/* Shared Tourism Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BaliNeraProvider>
      <BaliNeraInteriorApp />
    </BaliNeraProvider>
  );
}
