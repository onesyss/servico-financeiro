import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      content: 'O FinControl transformou completamente a maneira como gerencio minhas finanças. Agora tenho uma visão clara de para onde vai meu dinheiro e consigo economizar muito mais.',
      author: 'Ana Silva',
      role: 'Profissional Autônoma',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      content: 'Como dono de uma pequena empresa, o FinControl me ajudou a organizar as finanças do negócio de forma simples e eficiente. Os relatórios são excelentes para tomar decisões estratégicas.',
      author: 'Carlos Mendes',
      role: 'Proprietário de Empresa',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      content: 'Finalmente consegui organizar minhas finanças e criar um plano de aposentadoria realista. A interface é intuitiva e os recursos de planejamento financeiro são incríveis.',
      author: 'Juliana Costa',
      role: 'Gerente de Marketing',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Depoimentos</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            O que nossos clientes dizem
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Descubra como o FinControl está ajudando pessoas e empresas a transformar sua relação com o dinheiro.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 flex flex-col h-full">
              <div className="flex-grow">
                <svg className="h-8 w-8 text-primary-400 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
              </div>
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src={testimonial.image} alt={testimonial.author} />
                <div className="ml-4">
                  <div className="text-base font-medium text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;