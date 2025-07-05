import React from 'react';
import { Property } from '../types';
import { BedIcon, BathIcon, AreaIcon } from './PropertyCard';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onRemove: (propertyId: string) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, properties, onRemove }) => {
  if (!isOpen) return null;

  const features = [
    { key: 'price', label: 'Preço', render: (p: Property) => `R$ ${p.price.toLocaleString('pt-BR')}` },
    { key: 'specs', label: 'Especificações', render: (p: Property) => (
      <div className="space-y-2">
        <div className="flex items-center text-sm"><BedIcon className="w-5 h-5 mr-2 text-amber-500 flex-shrink-0" /><span>{p.bedrooms} quartos</span></div>
        <div className="flex items-center text-sm"><BathIcon className="w-5 h-5 mr-2 text-amber-500 flex-shrink-0" /><span>{p.bathrooms} banheiros</span></div>
        <div className="flex items-center text-sm"><AreaIcon className="w-5 h-5 mr-2 text-amber-500 flex-shrink-0" /><span>{p.sqft} m²</span></div>
      </div>
    )},
    { key: 'description', label: 'Descrição', render: (p: Property) => p.description },
    { key: 'personalizedPitch', label: 'Para Você', render: (p: Property) => <p className="italic">"{p.personalizedPitch}"</p> },
    { key: 'neighborhoodVibe', label: 'Vibrações do Bairro', render: (p: Property) => p.neighborhoodVibe },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-6 flex-shrink-0 border-b">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-gray-800">Comparando Imóveis</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Fechar modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        
        <div className="flex-grow overflow-auto">
          <div 
            className="grid" 
            style={{ gridTemplateColumns: `minmax(140px, auto) repeat(${properties.length}, minmax(240px, 1fr))` }}
          >
            {/* HEADERS */}
            <div className="sticky top-0 left-0 bg-gray-50 z-20"></div>
            {properties.map(p => (
              <div key={p.id} className="sticky top-0 p-2 sm:p-4 align-top bg-gray-50 z-10 border-b">
                <div className="bg-white p-2 rounded-lg shadow-sm h-full flex flex-col">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-24 sm:h-32 object-cover rounded-md mb-2"/>
                  <h3 className="font-bold text-sm md:text-base text-gray-800 flex-grow">{p.title}</h3>
                  <button onClick={() => onRemove(p.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold mt-1 self-start">Remover</button>
                </div>
              </div>
            ))}
            
            {/* FEATURE ROWS */}
            {features.map(feature => (
              <React.Fragment key={feature.key}>
                <div className="sticky left-0 p-4 align-top bg-gray-100 border-t">
                  <div className="font-bold text-sm sm:text-base text-gray-700">{feature.label}</div>
                </div>
                {properties.map(p => (
                  <td key={p.id} className="p-4 align-top bg-white border-t">
                    <div className="text-gray-600 text-sm md:text-base">{feature.render(p)}</div>
                  </td>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
