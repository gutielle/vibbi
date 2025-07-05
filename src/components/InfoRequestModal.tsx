import React, { useState, useEffect } from 'react';
import { Property } from '../types';

const CheckCircleIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface InfoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  userName: string;
}

const InfoRequestModal: React.FC<InfoRequestModalProps> = ({ isOpen, onClose, property, userName }) => {
    const [formData, setFormData] = useState({ name: '', email: '', contact: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsSubmitted(false);
            setFormData({ name: userName, email: '', contact: '' });
        }
    }, [isOpen, userName]);

    if (!isOpen && !isClosing) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Info Request Submitted:', formData);
        setIsSubmitted(true);
    };
    
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 ${isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="p-8">
                        <h2 className="text-3xl font-display text-gray-800">Quero mais informações</h2>
                        <p className="text-gray-600 mt-2 mb-6">Preencha os campos abaixo para receber mais detalhes sobre: <strong className="font-semibold text-gray-700">{property?.title}</strong></p>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="text-sm font-bold text-gray-700 block mb-1">Nome</label>
                                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400" />
                            </div>
                             <div>
                                <label htmlFor="email" className="text-sm font-bold text-gray-700 block mb-1">Email</label>
                                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400" />
                            </div>
                             <div>
                                <label htmlFor="contact" className="text-sm font-bold text-gray-700 block mb-1">Contato (Telefone/WhatsApp)</label>
                                <input id="contact" name="contact" type="text" value={formData.contact} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400" />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <button type="button" onClick={handleClose} className="px-6 py-3 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors">Cancelar</button>
                            <button type="submit" className="px-6 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-900 font-semibold transition-colors disabled:bg-gray-400">Enviar Pedido</button>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 text-center">
                       <CheckCircleIcon className="w-16 h-16 text-teal-500 mx-auto" />
                       <h2 className="text-3xl font-display text-gray-800 mt-4">Pedido Enviado!</h2>
                       <p className="text-gray-600 mt-4 mb-8 max-w-md mx-auto">
                           Sua solicitação de informações para <strong>{property?.title}</strong> foi enviada.
                           Nossa equipe entrará em contato em breve com todos os detalhes.
                       </p>
                       <div className="mt-8 flex justify-center">
                           <button onClick={handleClose} className="px-8 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 font-semibold transition-colors">Fechar</button>
                       </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoRequestModal;