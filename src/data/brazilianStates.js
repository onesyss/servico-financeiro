export const brazilianStates = [
  { value: 'AC', label: 'Acre', cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'] },
  { value: 'AL', label: 'Alagoas', cities: ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Penedo', 'Pilar'] },
  { value: 'AP', label: 'Amapá', cities: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Mazagão'] },
  { value: 'AM', label: 'Amazonas', cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'] },
  { value: 'BA', label: 'Bahia', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna'] },
  { value: 'CE', label: 'Ceará', cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'] },
  { value: 'DF', label: 'Distrito Federal', cities: ['Brasília', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Plano Piloto'] },
  { value: 'ES', label: 'Espírito Santo', cities: ['Vitória', 'Vila Velha', 'Serra', 'Linhares', 'Cariacica'] },
  { value: 'GO', label: 'Goiás', cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia'] },
  { value: 'MA', label: 'Maranhão', cities: ['São Luís', 'Imperatriz', 'Timon', 'Codó', 'Caxias'] },
  { value: 'MT', label: 'Mato Grosso', cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra'] },
  { value: 'MS', label: 'Mato Grosso do Sul', cities: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã'] },
  { value: 'MG', label: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'] },
  { value: 'PA', label: 'Pará', cities: ['Belém', 'Ananindeua', 'Santarém', 'Castanhal', 'Marabá'] },
  { value: 'PB', label: 'Paraíba', cities: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux'] },
  { value: 'PR', label: 'Paraná', cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'] },
  { value: 'PE', label: 'Pernambuco', cities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'] },
  { value: 'PI', label: 'Piauí', cities: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano'] },
  { value: 'RJ', label: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói'] },
  { value: 'RN', label: 'Rio Grande do Norte', cities: ['Natal', 'Mossoró', 'Parnamirim', 'Ceará-Mirim', 'Caicó'] },
  { value: 'RS', label: 'Rio Grande do Sul', cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'] },
  { value: 'RO', label: 'Rondônia', cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal'] },
  { value: 'RR', label: 'Roraima', cities: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Alto Alegre', 'Mucajaí'] },
  { value: 'SC', label: 'Santa Catarina', cities: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma'] },
  { value: 'SP', label: 'São Paulo', cities: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André'] },
  { value: 'SE', label: 'Sergipe', cities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão'] },
  { value: 'TO', label: 'Tocantins', cities: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins'] }
];

export const getCitiesByState = (stateValue) => {
  const state = brazilianStates.find(s => s.value === stateValue);
  return state ? state.cities : [];
};
