
import React from 'react';
import { Home, MessageSquare, Receipt, LogOut, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      id: "dashboard",
      visible: true
    },
    {
      title: "Mural",
      icon: MessageSquare,
      id: "mural",
      visible: true
    },
    {
      title: "Minhas Faturas",
      icon: Receipt,
      id: "faturas",
      visible: user?.tipoUsuario === 'Aluno'
    },
    {
      title: "Gerenciar Alunos",
      icon: Users,
      id: "alunos",
      visible: user?.tipoUsuario === 'Professor'
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pota-pink to-pota-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Pota SaaS</h2>
            <p className="text-sm text-gray-600">{user?.tipoUsuario}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 uppercase text-xs font-semibold mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.filter(item => item.visible).map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeSection === item.id}
                    className="w-full"
                  >
                    <button
                      onClick={() => onSectionChange(item.id)}
                      className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? 'bg-pota-pink text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">{user?.nomeCompleto}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
