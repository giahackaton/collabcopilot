
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainNavigation from './MainNavigation';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showCTA?: boolean;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ 
  title, 
  subtitle, 
  children, 
  showCTA = true 
}) => {
  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="prose prose-lg prose-indigo mx-auto">
          {children}
        </div>
        {showCTA && (
          <div className="mt-16 text-center">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              <Link to="/auth">Comenzar ahora</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Firma del equipo PromptHunters */}
      <footer className="py-6 bg-gray-50">
        <div className="text-center text-sm">
          <p className="font-medium text-gray-700">Realizado por PromptHunters</p>
          <div className="mt-2 flex justify-center">
            <img 
              src="/lovable-uploads/13a53363-7e73-4d5c-acf0-1662f401864b.png" 
              alt="Logo PromptHunters" 
              className="h-8" 
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageTemplate;
