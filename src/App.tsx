import React, { useState, ChangeEvent } from 'react';
import { Preferences, Property } from './types';
import { generatePropertyListings, generateSimilarListings } from './services/geminiService';
import Spinner from './components/Spinner';
import PropertyCard from './components/PropertyCard';
import SchedulingModal from './components/SchedulingModal';
import InfoRequestModal from './components/InfoRequestModal';

const initialPreferences: Preferences = {
  name: '',
  intention: 'Comprar',
  propertyType: '',
  otherPropertyType: '',
  budget: { min: 500000, max: 2000000 },
  location: 'São Paulo',
  priorities: [],
  otherPriorities: '',
  bedrooms: 3,
  bathrooms: 2,
  extras: [],
  otherExtras: '',
};

const propertyTypeOptions = ['Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Studio', 'Sítio/Chácara'];
const prioritiesOptions = ['Perto de boas escolas', 'Perto do trabalho', 'Bairro tranquilo', 'Vida noturna agitada', 'Perto de parques'];
const extrasOptions = ['Garagem', 'Quintal', 'Cozinha moderna', 'Home office', 'Piscina', 'Varanda gourmet'];

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const [listings, setListings] = useState<Property[]>([]);
  const [similarListings, setSimilarListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [propertyToSchedule, setPropertyToSchedule] = useState<Property | null>(null);
  
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [propertyForInfoRequest, setPropertyForInfoRequest] = useState<Property | null>(null);
  
  const [isRefineSearchOpen, setIsRefineSearchOpen] = useState(false);


  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const digits = value.replace(/\D/g, '');
    const numberValue = digits ? parseInt(digits, 10) : 0;
    
    setPreferences(prev => ({
        ...prev,
        budget: {
            ...prev.budget,
            [name]: numberValue
        }
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, field: 'priorities' | 'extras') => {
    const { value, checked } = e.target;
    setPreferences(prev => {
      const currentValues = prev[field];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleFindProperties = async () => {
    setIsLoading(true);
    setError(null);
    setListings([]);
    setSimilarListings([]);
    try {
      setLoadingMessage("Criando recomendações sob medida...");
      const properties = await generatePropertyListings(preferences, setLoadingMessage);
      setListings(properties);
      setStep(6); 

      const similarProps = await generateSimilarListings(preferences, properties, setLoadingMessage);
      setSimilarListings(similarProps);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
      setListings([]);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleRefineSearch = async () => {
    setIsLoading(true);
    setError(null);
    setListings([]);
    setSimilarListings([]);
    try {
      setLoadingMessage("Refinando sua busca...");
      const properties = await generatePropertyListings(preferences, setLoadingMessage);
      setListings(properties);
      setIsRefineSearchOpen(false); // Close the panel after search

      const similarProps = await generateSimilarListings(preferences, properties, setLoadingMessage);
      setSimilarListings(similarProps);
      
    } catch (err: any) {
       setError(err.message || 'Ocorreu um erro desconhecido.');
       setListings([]);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };
  
  const handleSchedule = (property: Property) => {
    setPropertyToSchedule(property);
    setIsSchedulingModalOpen(true);
  };

  const handleCloseScheduling = () => {
    setIsSchedulingModalOpen(false);
    setTimeout(() => setPropertyToSchedule(null), 300);
  };

  const handleInfoRequest = (property: Property) => {
    setPropertyForInfoRequest(property);
    setIsInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
    setTimeout(() => setPropertyForInfoRequest(null), 300);
  };

  const resetSearch = () => {
    setStep(1);
    setListings([]);
    setSimilarListings([]);
    setPreferences(initialPreferences);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-4xl font-display mb-4">Bem-vindo(a) ao Vibbi</h2>
            <p className="text-lg text-gray-600 mb-8">Vamos encontrar a casa dos seus sonhos, com a sua vibe. Para começar, como podemos te chamar?</p>
            <input type="text" name="name" value={preferences.name} onChange={handleChange} placeholder="Digite seu nome" className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400" />
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white p-4 border-t border-gray-200 md:relative md:bg-transparent md:p-0 md:border-none md:mt-8">
                <button onClick={handleNext} disabled={!preferences.name} className="w-full bg-gray-800 text-white font-bold py-4 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400">Avançar</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-4xl font-display mb-2">Prazer, {preferences.name}!</h2>
            <p className="text-lg text-gray-600 mb-8">Nos conte, qual o seu objetivo e que tipo de imóvel você busca?</p>
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-3">Sua pretensão é...</h3>
                    <div className="flex space-x-4">
                      {(['Comprar', 'Alugar'] as const).map(intention => (
                        <button key={intention} onClick={() => setPreferences(p => ({ ...p, intention }))} className={`w-full p-4 rounded-lg border-2 text-lg font-bold transition-colors ${ preferences.intention === intention ? 'bg-amber-500 text-white border-amber-500' : 'bg-white hover:bg-amber-50 border-gray-300' }`} >
                          {intention}
                        </button>
                      ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">E o tipo de imóvel é...</h3>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {propertyTypeOptions.map(opt => (
                           <button key={opt} onClick={() => setPreferences(p => ({ ...p, propertyType: opt, otherPropertyType: '' }))} className={`flex items-center justify-center text-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${ preferences.propertyType === opt ? 'bg-amber-500 text-white border-amber-500 font-semibold' : 'bg-white hover:bg-amber-50 border-gray-300' }`}>
                            <span>{opt}</span>
                          </button>
                        ))}
                    </div>
                    <div className="mt-4">
                      <input type="text" name="otherPropertyType" value={preferences.otherPropertyType} onChange={handleChange} onFocus={() => setPreferences(p => ({...p, propertyType: 'Outro'}))} placeholder="Outro tipo? Descreva aqui." className="w-full p-4 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-amber-400 focus:border-amber-400" />
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white p-4 border-t border-gray-200 md:relative md:bg-transparent md:p-0 md:border-none md:mt-8 flex justify-between space-x-4">
              <button onClick={handleBack} className="w-1/2 bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-lg hover:bg-gray-300">Voltar</button>
              <button onClick={handleNext} disabled={!preferences.propertyType} className="w-1/2 bg-gray-800 text-white font-bold py-4 px-8 rounded-lg hover:bg-gray-900 disabled:bg-gray-400">Avançar</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-4xl font-display mb-8">Qual é a sua faixa de orçamento?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mínimo</label>
                <input type="text" name="min" value={`R$ ${preferences.budget.min.toLocaleString('pt-BR')}`} onChange={handleBudgetChange} className="w-full p-4 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Máximo</label>
                <input type="text" name="max" value={`R$ ${preferences.budget.max.toLocaleString('pt-BR')}`} onChange={handleBudgetChange} className="w-full p-4 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white p-4 border-t border-gray-200 md:relative md:bg-transparent md:p-0 md:border-none md:mt-8 flex justify-between space-x-4">
              <button onClick={handleBack} className="w-1/2 bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-lg hover:bg-gray-300">Voltar</button>
              <button onClick={handleNext} className="w-1/2 bg-gray-800 text-white font-bold py-4 px-8 rounded-lg hover:bg-gray-900">Avançar</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-4xl font-display mb-8">Onde você se imagina morando?</h2>
            <div className="space-y-6">
              <input type="text" name="location" value={preferences.location} onChange={handleChange} placeholder="Cidade ou bairro" className="w-full p-4 border border-gray-300 rounded-lg" />
              <div>
                <h3 className="text-xl font-bold mb-3">Quais são suas prioridades?</h3>
                <div className="grid grid-cols-2 gap-4">
                    {prioritiesOptions.map(opt => (
                        <label key={opt} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-amber-50 cursor-pointer">
                            <input type="checkbox" value={opt} checked={preferences.priorities.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'priorities')} className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-4">
                  <input type="text" name="otherPriorities" value={preferences.otherPriorities} onChange={handleChange} placeholder="Outra prioridade? Descreva aqui." className="w-full p-4 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-amber-400 focus:border-amber-400" />
                </div>
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white p-4 border-t border-gray-200 md:relative md:bg-transparent md:p-0 md:border-none md:mt-8 flex justify-between space-x-4">
              <button onClick={handleBack} className="w-1/2 bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-lg hover:bg-gray-300">Voltar</button>
              <button onClick={handleNext} className="w-1/2 bg-gray-800 text-white font-bold py-4 px-8 rounded-lg hover:bg-gray-900">Avançar</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-4xl font-display mb-8">Os detalhes essenciais.</h2>
            <div className="space-y-6">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Quartos</label>
                        <input type="number" name="bedrooms" min="0" value={preferences.bedrooms} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-lg"/>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Banheiros</label>
                        <input type="number" name="bathrooms" min="0" value={preferences.bathrooms} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-lg"/>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">O que não pode faltar?</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {extrasOptions.map(opt => (
                            <label key={opt} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-amber-50 cursor-pointer">
                                <input type="checkbox" value={opt} checked={preferences.extras.includes(opt)} onChange={(e) => handleCheckboxChange(e, 'extras')} className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500"/>
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-4">
                      <input type="text" name="otherExtras" value={preferences.otherExtras} onChange={handleChange} placeholder="Outro item? Descreva aqui." className="w-full p-4 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-amber-400 focus:border-amber-400" />
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white p-4 border-t border-gray-200 md:relative md:bg-transparent md:p-0 md:border-none md:mt-8 flex justify-between space-x-4">
              <button onClick={handleBack} className="w-1/2 bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-lg hover:bg-gray-300">Voltar</button>
              <button onClick={handleFindProperties} className="w-1/2 bg-amber-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-amber-600 transition-colors">Encontrar meu lar</button>
            </div>
          </div>
        );
      case 6: // Results
        return (
            <div className="pb-40">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-display text-gray-800">Aqui estão suas recomendações, {preferences.name}.</h1>
                    <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">A Vibbi analisou seus desejos para encontrar estes lares especiais para você.</p>
                </div>

                <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-md mb-10">
                    <button 
                        onClick={() => setIsRefineSearchOpen(prev => !prev)}
                        className="w-full flex justify-between items-center text-left p-2"
                    >
                        <h3 className="text-2xl font-display text-gray-800">Alterar orçamento</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${isRefineSearchOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isRefineSearchOpen && (
                        <div className="mt-4 animate-fade-in">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                                <div className="w-full md:w-auto">
                                    <input type="text" name="min" value={`R$ ${preferences.budget.min.toLocaleString('pt-BR')}`} onChange={handleBudgetChange} placeholder="Orçamento Mínimo" className="w-full p-3 border border-gray-300 rounded-lg text-center" />
                                </div>
                                <div className="w-full md:w-auto">
                                    <input type="text" name="max" value={`R$ ${preferences.budget.max.toLocaleString('pt-BR')}`} onChange={handleBudgetChange} placeholder="Orçamento Máximo" className="w-full p-3 border border-gray-300 rounded-lg text-center" />
                                </div>
                                <div className="w-full md:w-auto self-center">
                                    <button onClick={handleRefineSearch} className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors">
                                        Buscar Novamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map(prop => (
                        <PropertyCard 
                          key={prop.id} 
                          property={prop}
                          preferences={preferences}
                          onSchedule={handleSchedule}
                          onInfoRequest={handleInfoRequest}
                        />
                    ))}
                </div>

                {similarListings.length > 0 && (
                    <div className="mt-20">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-display text-gray-800">Você também pode gostar</h2>
                            <p className="text-xl text-gray-600 mt-2">Encontramos algumas alternativas que podem te surpreender.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {similarListings.map(prop => (
                                <PropertyCard 
                                key={prop.id} 
                                property={prop} 
                                preferences={preferences}
                                onSchedule={handleSchedule}
                                onInfoRequest={handleInfoRequest}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center mt-20">
                    <button onClick={resetSearch} className="bg-gray-800 text-white font-bold py-4 px-10 rounded-lg hover:bg-gray-900 transition-colors">
                        Começar uma Nova Busca
                    </button>
                </div>
            </div>
        )
      default:
        return <div>Etapa desconhecida</div>;
    }
  };

  const progress = step <= 5 ? (step - 1) / 5 * 100 : 100;

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {isLoading && <Spinner message={loadingMessage || "Buscando propriedades..."} />}

      <SchedulingModal 
        isOpen={isSchedulingModalOpen}
        onClose={handleCloseScheduling}
        property={propertyToSchedule}
      />

      <InfoRequestModal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        property={propertyForInfoRequest}
        userName={preferences.name}
      />
      
      <header className="py-4 px-8 bg-white shadow-sm flex items-center space-x-3 sticky top-0 z-40">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <h1 className="text-2xl font-bold font-display">Vibbi</h1>
      </header>

      <main className="container mx-auto p-4 sm:p-8 pb-32 md:pb-8">
        {step < 6 ? (
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-md">
            <div className="mb-8">
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-amber-700">Etapa {step} de 5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
              </div>
            </div>
            {renderStep()}
          </div>
        ) : (
          renderStep()
        )}
        {error && <div className="max-w-3xl mx-auto mt-4 text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
      </main>
    </div>
  );
};

export default App;