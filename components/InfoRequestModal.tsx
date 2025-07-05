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
                     <div className="p-8 text-left">
                       <div className="flex justify-center mb-4">
                          <CheckCircleIcon className="w-16 h-16 text-teal-500 mx-auto" />
                       </div>
                       <h2 className="text-3xl font-display text-gray-800 mt-4 text-center">Pedido Enviado!</h2>
                       <p className="text-gray-600 mt-2 mb-6 text-center">
                           Estamos preparando um material completo para você.
                       </p>

                       <div className="bg-gray-100 p-4 rounded-lg space-y-4 text-gray-700">
                         <h3 className="font-bold text-lg text-gray-800 text-center">E agora?</h3>
                         <div>
                            <h4 className="font-bold">Material a Caminho</h4>
                            <p className="text-sm">Nossa equipe está compilando todas as informações sobre <strong>{property?.title}</strong> e enviará para seu e-mail e/ou WhatsApp em breve.</p>
                         </div>
                         <div>
                            <h4 className="font-bold">Fique de Olho</h4>
                            <p className="text-sm">Dica: Verifique sua caixa de spam caso não receba nosso contato em algumas horas. Estamos ansiosos para te ajudar a encontrar seu novo lar!</p>
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

export default InfoRequestModal;