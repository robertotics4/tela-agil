import PowerOutageFlow from '..';
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
      },
    ],
  },
  {
    id: 'f1-q3',
    title: 'Faltou energia na rua toda ou só na sua casa?',
    options: [
      {
        answer: 'Rua toda',
      },
      {
        answer: 'Minha casa',
        nextQuestionId: 'f1-q4',
      },
    ],
  },
  {
    id: 'f1-q4',
    title:
      'Você fez o teste do disjuntor? Ele ficou no mesmo lugar ou desligou de novo?',
    options: [
      {
        answer: 'Mesmo lugar',
        nextQuestionId: 'f1-q5',
      },
      {
        answer: 'Desligou de novo',
        nextQuestionId: 'f1-r1',
      },
    ],
  },
  {
    id: 'f1-q5',
    title: 'Posso confirmar sua solicitação?',
    options: [
      {
        answer: 'Sim',
        nextQuestionId: 'f1-r2',
      },
      {
        answer: 'Não',
      },
    ],
  },
  {
    id: 'f1-r1',
    title:
      'Pelas informações que você passou, parece que você está com um defeito interno.',
    options: [
      {
        answer: 'Voltar',
      },
    ],
  },
  {
    id: 'f1-r2',
    title: 'Solicitação gerada com sucesso',
    options: [
      {
        answer: 'Finalizar serviço',
      },
    ],
  },
  {
    id: 'f2-q1',
    title: 'Oscilando há mais de 7 dias?',
    options: [
      {
        answer: 'Sim',
      },
      {
        answer: 'Não',
      },
    ],
  },
];

export default powerOutageQuestions;