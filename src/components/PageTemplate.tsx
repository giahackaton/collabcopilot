
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    </div>
  );
};

export default PageTemplate;
