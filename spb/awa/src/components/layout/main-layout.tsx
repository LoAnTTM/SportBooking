import React from "react";
import ClientWrapper from "./client-wrapper";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  showSearch?: boolean;
}

const MainLayout = ({ children, title, showSearch = false }: MainLayoutProps) => {
  return (
    <ClientWrapper title={title} showSearch={showSearch}>
      {children}
    </ClientWrapper>
  );
};

export default MainLayout;
