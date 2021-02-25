import { Question } from '../../../StepModal';

const powerOutageQuestions: Question[] = [
  {
    id: 'f1-q1',
    title:
      'Você está totalmente sem energia ou sua luz está oscilando (ou fraca) ?',
    options: [
      {
        answer: 'Sem energia',
        nextQuestionId: 'f1-q2',
      },
      {
        answer: 'Oscilando ou fraca',
        nextQuestionId: 'f2-q1',
      },
    ],
  },
  {
    id: 'f1-q2',
    title: 'Faltou luz em todo o seu imóvel ou apenas em algumas partes dele?',
    options: [
      {
        answer: 'Todo o imóvel',
        nextQuestionId: 'f1-q3',
      },
      {
        answer: 'Algumas partes',
        nextQuestionId: 'teste-disjuntor',
      },
    ],
  },
  {
    id: 'f1-q3',
    title: 'Faltou energia na rua toda ou só na sua casa?',
    options: [
      {
        answer: 'Rua toda',
        nextQuestionId: 'abrir-servico-falta-energia-completa',
      },
      {
        answer: 'Minha casa',
        nextQuestionId: 'teste-disjuntor',
      },
    ],
  },
  {
    id: 'f2-q1',
    title: 'Oscilando há mais de 7 dias?',
    options: [
      {
        answer: 'Sim',
        nextQuestionId: 'resposta-variacao-tensao',
      },
      {
        answer: 'Não',
        nextQuestionId: 'abrir-avaliacao-tecnica',
      },
    ],
  },
  {
    id: 'teste-disjuntor',
    title:
      'Antes de abrir sua solicitação, preciso que você faça um teste. Vá até a chave geral e certifique-se que o disjuntor está desligado (com o sinal | aparente). Após ligar novamente, o disjuntor ficou no mesmo lugar ou desligou de novo?',
    options: [
      {
        answer: 'Mesmo lugar',
        nextQuestionId: 'abrir-servico-falta-fase',
      },
      {
        answer: 'Desligou de novo',
        nextQuestionId: 'resposta-defeito-interno',
      },
    ],
  },
  {
    id: 'abrir-servico-falta-energia-completa',
    title: 'Posso confirmar sua solicitação?',
    options: [
      {
        answer: 'Sim',
        action: 'falta-energia-completa',
      },
      {
        answer: 'Não',
      },
    ],
  },
  {
    id: 'abrir-servico-falta-fase',
    title: 'Você confirma a abertura do serviço de falta de fase?',
    options: [
      {
        answer: 'Sim',
        action: 'falta-energia-fase',
      },
      {
        answer: 'Não',
      },
    ],
  },
  {
    id: 'abrir-avaliacao-tecnica',
    title:
      'Para resolver o seu problema, preciso abrir uma avaliação técnica de fornecimento. Posso gerar o serviço para você?',
    options: [
      {
        answer: 'Sim',
        action: 'falta-energia-oscilacao',
      },
      {
        answer: 'Não',
      },
    ],
  },
  {
    id: 'resposta-defeito-interno',
    title:
      'Pelas informações que você passou, parece que você está com um defeito interno.',
    options: [
      {
        answer: 'Voltar',
      },
    ],
  },
  {
    id: 'resposta-variacao-tensao',
    title:
      'Parece que você está com uma variação no seu nível tensão. Para resolver essa solicitação, ligue para o 116.',
    options: [
      {
        answer: 'Voltar',
      },
    ],
  },
  {
    id: 'resposta-solicitacao-sucesso',
    title: 'Solicitação gerada com sucesso',
    options: [
      {
        answer: 'Finalizar serviço',
      },
    ],
  },
];

export default powerOutageQuestions;
