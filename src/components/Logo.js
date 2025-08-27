import React from 'react';
import { WalletIcon } from '@heroicons/react/24/outline';

function Logo({ size = 'default', showText = true, className = '' }) {
  const sizeClasses = {
    small: 'h-8 w-8',
    default: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const textSizes = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg`}>
        <WalletIcon className={`${size === 'small' ? 'h-5 w-5' : size === 'large' ? 'h-10 w-10' : 'h-7 w-7'} text-white`} />
      </div>
      {showText && (
        <div className="ml-3">
          <h1 className={`${textSizes[size]} font-bold text-gray-900 dark:text-gray-100`}>
            ControlFin
          </h1>
          <p className={`${size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'} text-gray-600 dark:text-gray-400 font-medium`}>
            Gestão Financeira Inteligente
          </p>
        </div>
      )}
    </div>
  );
}

export default Logo;
