import React, { useState, useEffect } from 'react';
import { Property } from '../types';

const CalendarIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const CheckCircleIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose, property }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            setIsConfirmed(false);
            setSelectedDate('');
            setSelectedTime('');
        }
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    const handleConfirm = () => {
        setIsConfirmed(true);
    };
    
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // Duration of the closing animation
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 ${isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                {!isConfirmed ? (
                    <div className="p-8">
                        <h2 className="text-3xl font-display text-gray-800">Agendar Visita</h2>
                        <p className="text-gray-600 mt-2 mb-1">Você está agendando uma visita para: <strong className="font-semibold text-gray-700">{property?.title}</strong></p>
                        <p className="text-sm text-gray-500 mt-1 mb-6">Nossos especialistas estão prontos para te apresentar este imóvel.</p>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="visit-date" className="text-sm font-bold text-gray-700 flex items-center mb-2"><CalendarIcon className="w-5 h-5 mr-2 text-amber-500" />Data da Visita</label>
                                <input 
                                  id="visit-date" 
                                  type="date" 
                                  value={selectedDate} 
                                  onChange={e => setSelectedDate(e.target.value)} 
                                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white ${selectedDate ? 'text-gray-900' : 'text-gray-500'}`} 
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Período de Preferência</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Manhã (9h-12h)', 'Tarde (14h-17h)'].map(time => (
                                        <button key={time} onClick={() => setSelectedTime(time)} className={`p-3 rounded-lg border-2 text-center transition-colors ${selectedTime === time ? 'bg-amber-500 text-white border-amber-500' : 'bg-white hover:bg-amber-50 border-gray-300'}`}>
                                            {time}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">Horários populares são preenchidos rapidamente.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <button onClick={handleClose} className="px-6 py-3 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors">Cancelar</button>
                            <button onClick={handleConfirm} disabled={!selectedDate || !selectedTime} className="px-6 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-900 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">Confirmar Agendamento</button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-left">
                       <div className="flex justify-center mb-4">
                          <CheckCircleIcon className="w-16 h-16 text-teal-500 mx-auto" />
                       </div>
                       <h2 className="text-3xl font-display text-gray-800 mt-4 text-center">Solicitação Enviada!</h2>
                       <p className="text-gray-600 mt-2 mb-6 text-center">
                           O primeiro passo para conhecer seu novo lar foi dado.
                       </p>

                       <div className="bg-gray-100 p-4 rounded-lg space-y-4 text-gray-700">
                         <h3 className="font-bold text-lg text-gray-800 text-center">E agora?</h3>
                         <div>
                            <h4 className="font-bold">Confirmação em Breve</h4>
                            <p className="text-sm">Um de nossos consultores Vibbi entrará em contato com você pelo telefone ou e-mail para confirmar a data e o horário da sua visita.</p>
                         </div>
                         <div>
                            <h4 className="font-bold">Prepare-se para a Visita</h4>
                            <p className="text-sm">Dica: Anote quaisquer perguntas que você tenha sobre o imóvel ou o bairro. Queremos que você tenha todas as informações para tomar a melhor decisão.</p>
                         </div>
                       </div>
                       
                       <div className="mt-8 flex justify-center">
                           <button onClick={handleClose} className="w-full px-8 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 font-semibold transition-colors">Entendido, obrigado!</button>
                       </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchedulingModal;