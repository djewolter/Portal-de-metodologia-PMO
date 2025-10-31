import React from 'react';
import BackButton from '../components/BackButton';

const TrainingPage: React.FC = () => {
  return (
    <main className="flex-grow bg-gray-100">
      <div className="container mx-auto px-6 py-16">
        <BackButton />
        <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Treinamentos e Capacitações
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Página em construção.
            </p>
        </div>
      </div>
    </main>
  );
};

export default TrainingPage;
