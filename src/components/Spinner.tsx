import React from 'react';

interface SpinnerProps {
  message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-50 text-white">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-400"></div>
      <p className="mt-4 text-lg font-semibold tracking-wider">{message}</p>
      <p className="text-sm text-gray-300">A IA está trabalhando para você...</p>
    </div>
  );
};

export default Spinner;