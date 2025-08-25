import React from 'react';
import { Link } from 'react-router-dom';

function CallToAction() {
  return (
    <section id="pricing" className="bg-primary-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-200 tracking-wide uppercase">Preços</h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Planos para todos os perfis
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-100">
            Escolha o plano ideal para suas necessidades financeiras.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Plano Básico */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-medium text-gray-900">Básico</h3>
              <p className="mt-4 text-gray-500">Ideal para uso pessoal e iniciantes.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">R$0</span>
                <span className="text-base font-medium text-gray-500">/mês</span>
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Controle de gastos básico</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Até 2 contas bancárias</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Relatórios mensais</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Suporte por email</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-8 bg-gray-50">
              <Link to="/signup" className="block w-full btn btn-outline text-center">
                Começar Grátis
              </Link>
            </div>
          </div>

          {/* Plano Pro */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-primary-500 transform scale-105">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-medium text-gray-900">Pro</h3>
              <p className="mt-4 text-gray-500">Para indivíduos que buscam controle financeiro completo.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">R$29</span>
                <span className="text-base font-medium text-gray-500">/mês</span>
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Tudo do plano Básico</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Até 10 contas bancárias</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Planejamento de orçamento</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Metas financeiras</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Suporte prioritário</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-8 bg-gray-50">
              <Link to="/signup" className="block w-full btn btn-primary text-center">
                Assinar Agora
              </Link>
            </div>
          </div>

          {/* Plano Empresarial */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-medium text-gray-900">Empresarial</h3>
              <p className="mt-4 text-gray-500">Para empresas e equipes financeiras.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">R$99</span>
                <span className="text-base font-medium text-gray-500">/mês</span>
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Tudo do plano Pro</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Contas ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Múltiplos usuários</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">Relatórios avançados</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-gray-600">API para integração</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-8 bg-gray-50">
              <Link to="/contact" className="block w-full btn btn-outline text-center">
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;