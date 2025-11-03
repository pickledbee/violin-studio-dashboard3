
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 rounded-lg bg-brand-surface border border-brand-primary shadow-lg">
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
        Bruce Bowers’ Violin Studio
      </h1>
      <p className="mt-2 text-lg text-brand-text-secondary">
        Lesson Schedule & Income Summary
      </p>
    </header>
  );
};

export default Header;
