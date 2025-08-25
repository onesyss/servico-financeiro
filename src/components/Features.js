import React from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

function Features() {
  const features = [
    {
      name: 'Análise de gastos',
      description: 'Visualize e categorize automaticamente seus gastos para entender para onde seu dinheiro está indo.',
      icon: ChartBarIcon,
    },
    {
      name: 'Orçamentos personalizados',
      description: 'Crie orçamentos personalizados para diferentes categorias e receba alertas quando estiver próximo do limite.',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Alertas e notificações',
      description: 'Receba alertas sobre faturas próximas do vencimento, gastos incomuns e oportunidades de economia.',
      icon: BellAlertIcon,
    },
    {
      name: 'Metas financeiras',
      description: 'Estabeleça metas de economia, investimento ou quitação de dívidas e acompanhe seu progresso.',
      icon: ArrowTrendingUpIcon,
    },
    {
      name: 'Relatórios detalhados',
      description: 'Acesse relatórios detalhados sobre sua saúde financeira, fluxo de caixa e tendências de gastos.',
      icon: DocumentChartBarIcon,
    },
    {
      name: 'Acesso em qualquer dispositivo',
      description: 'Gerencie suas finanças em qualquer lugar com nosso aplicativo móvel e sincronização em tempo real.',
      icon: DevicePhoneMobileIcon,
    },
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Recursos</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Tudo que você precisa para controlar suas finanças
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Nossa plataforma oferece ferramentas poderosas para ajudar você a gerenciar seu dinheiro de forma inteligente e eficiente.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;