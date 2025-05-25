
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { DashboardProfessor } from './DashboardProfessor';
import { DashboardAluno } from './DashboardAluno';
import { Mural } from './Mural';
import { useAuth } from '@/contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return user?.tipoUsuario === 'Professor' ? <DashboardProfessor /> : <DashboardAluno />;
      case 'mural':
        return <Mural />;
      case 'faturas':
        return <DashboardAluno />;
      case 'alunos':
        return <DashboardProfessor />;
      default:
        return user?.tipoUsuario === 'Professor' ? <DashboardProfessor /> : <DashboardAluno />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1">
          <div className="border-b border-gray-200 bg-white">
            <div className="flex items-center gap-4 p-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bem-vindo, {user?.nomeCompleto}
                </h2>
                <p className="text-sm text-gray-500">
                  {user?.tipoUsuario} • {user?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
