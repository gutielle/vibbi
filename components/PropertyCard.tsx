import React from 'react';
import { Property, Preferences } from '../types';

interface PropertyCardProps {
  property: Property;
  preferences: Preferences;
  onSchedule: (property: Property) => void;
  onInfoRequest: (property: Property) => void;
}

export const BedIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
);

export const BathIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM3.8 20.2a9 9 0 0116.4 0" />
        <path d="M2.5 20.5a10.5 10.5 0 0019 0" />
        <path d="M5 13.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM22 13.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
);

export const AreaIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4m12 4V4h-4m-8 12v4h4m4-4v4h4M4 4l16 16" />
    </svg>
);

export const MapPinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CalendarIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const InfoIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AiAnalysisIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const CheckIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const PropertyCard: React.FC<PropertyCardProps> = ({ property, preferences, onSchedule, onInfoRequest }) => {
  const userPriorities = [...preferences.priorities, preferences.otherPriorities].filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col">
      <img 
        className="w-full h-56 object-cover" 
        src={property.imageUrl || `https://picsum.photos/800/600?random=${property.id}`} 
        alt={property.title} 
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-display text-gray-800">{property.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{property.address}</p>
        <p className="text-3xl font-bold text-amber-600 my-4">
          R$ {property.price.toLocaleString('pt-BR')}
        </p>
        <div className="flex justify-around text-gray-700 border-t border-b border-gray-200 py-3 my-4">
          <div className="flex items-center space-x-2">
            <BedIcon className="w-6 h-6 text-amber-500" />
            <span>{property.bedrooms} quartos</span>
          </div>
          <div className="flex items-center space-x-2">
            <BathIcon className="w-6 h-6 text-amber-500" />
            <span>{property.bathrooms} banhs</span>
          </div>
          <div className="flex items-center space-x-2">
             <AreaIcon className="w-6 h-6 text-amber-500" />
            <span>{property.sqft} m²</span>
          </div>
        </div>
        <p className="text-gray-600 flex-grow">{property.description}</p>
        
        {userPriorities.length > 0 && (
          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h4 className="font-bold text-teal-800">Combina com seus desejos:</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                {userPriorities.map(priority => (
                  <li key={priority} className="flex items-center space-x-2 text-teal-700">
                    <CheckIcon className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">{priority}</span>
                  </li>
                ))}
              </ul>
          </div>
        )}
        
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-bold text-amber-800 flex items-center">
                <AiAnalysisIcon className="w-5 h-5 mr-2" />
                Análise da Vibbi para Você
            </h4>
            <p className="text-amber-700 italic mt-2">"{property.personalizedPitch}"</p>
        </div>
        
        {property.neighborhoodVibe && (
            <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-bold text-indigo-800 flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    Vibrações do Bairro
                </h4>
                <p className="text-indigo-700 mt-2">{property.neighborhoodVibe}</p>
            </div>
        )}

        {property.suggestionReason && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 flex items-center">
                    <AiAnalysisIcon className="w-5 h-5 mr-2" />
                    Por que sugerimos?
                </h4>
                <p className="text-blue-700 mt-2 italic">"{property.suggestionReason}"</p>
            </div>
        )}

        <div className="mt-auto pt-6 space-y-3">
            <button
              onClick={() => onSchedule(property)}
              className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <CalendarIcon />
              <span>Agendar Visita</span>
            </button>
            <button
              onClick={() => onInfoRequest(property)}
              className="w-full bg-white text-gray-800 font-bold py-3 px-4 rounded-lg border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <InfoIcon />
              <span>Informações</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;