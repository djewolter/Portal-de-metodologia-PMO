import React, { useState } from 'react';
import DeliveryCard from '../components/DeliveryCard';
import { deliveryData } from '../data/deliveryData';
import BackButton from '../components/BackButton';

const UpcomingDeliveriesPage: React.FC = () => {
  const [openCardId, setOpenCardId] = useState<string | null>(deliveryData[0]?.id || null);

  const handleToggleCard = (cardId: string) => {
    setOpenCardId(prevId => (prevId === cardId ? null : cardId));
  };

  return (
    <main className="flex-grow bg-gradient-to-br from-gray-100 via-white to-[#3095A6]/10 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <BackButton />
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Próximas Entregas
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Acompanhe o progresso das entregas prioritárias do Escritório de Projetos.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          {deliveryData.map(card => (
            <DeliveryCard
              key={card.id}
              data={card}
              isOpen={openCardId === card.id}
              onToggle={() => handleToggleCard(card.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default UpcomingDeliveriesPage;