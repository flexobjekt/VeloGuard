import React from 'react';
import { ViewState } from '../types';
import { Shield, Bike, FileWarning, ShoppingBag, User, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`flex flex-col items-center justify-center w-full py-3 space-y-1 transition-colors ${
        currentView === view ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2" onClick={() => setView('DASHBOARD')}>
          <div className="bg-blue-600 p-2 rounded-lg text-white cursor-pointer">
            <Shield size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight cursor-pointer">VeloGuard</h1>
        </div>
        <button 
          onClick={() => setView('PROFILE')}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          <User size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 max-w-3xl mx-auto w-full px-4 pt-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-20 shadow-lg">
        <div className="max-w-3xl mx-auto flex justify-between items-center px-2">
          <NavItem view="DASHBOARD" icon={Bike} label="Meine Räder" />
          <NavItem view="REGISTER" icon={PlusCircle} label="Registrieren" />
          <NavItem view="REPORT" icon={FileWarning} label="Melden" />
          <NavItem view="MARKET" icon={ShoppingBag} label="Markt" />
        </div>
      </nav>
    </div>
  );
};
