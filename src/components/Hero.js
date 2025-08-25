import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-primary-600 sm:text-base lg:text-sm xl:text-base">
                Controle financeiro simplificado
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-gray-900">Gerencie suas finanças</span>
                <span className="block text-primary-600">com inteligência</span>
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Organize suas finanças pessoais e empresariais em um só lugar. Acompanhe gastos, crie orçamentos, 
              estabeleça metas e tome decisões financeiras inteligentes com nossa plataforma completa.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg font-medium">
                  Começar Grátis
                </Link>
                <Link to="/#features" className="btn btn-outline px-8 py-3 text-lg font-medium flex items-center justify-center">
                  Saiba mais
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Experimente gratuitamente por 14 dias. Não é necessário cartão de crédito.
              </p>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                  alt="Dashboard de controle financeiro"
                />
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <button
                    type="button"
                    className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-600 bg-opacity-75 hover:bg-opacity-100 transition-opacity duration-150 ease-in-out"
                    aria-label="Reproduzir vídeo de demonstração"
                  >
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;