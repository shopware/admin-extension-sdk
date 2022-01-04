import { _subtract } from './../../src/messages.types';
import './style.css';
import { handleFactory, send, subscribe } from '../../src/channel';

const handle = handleFactory({})
const actionType = document.getElementById('actionType')! as HTMLInputElement
const actionValue = document.getElementById('actionValue')! as HTMLTextAreaElement
const sendAction = document.getElementById('sendAction')!;
const subscribeAction = document.getElementById('subscribeAction')!;
const result = document.getElementById('result')!;

const callMethodInMainWindow = document.getElementById('callMethodInMainWindow');
const firstNumber = document.getElementById('firstNumber')! as HTMLInputElement
const secondNumber = document.getElementById('secondNumber')! as HTMLInputElement
const methodResult = document.getElementById('methodResult')!;

sendAction.addEventListener('click', () => {
  const actionTypeValue = actionType.value;
  const actionValueValue = actionValue.value;

  send(actionTypeValue as any, JSON.parse(actionValueValue))
    .then((dataFromMain) => {
      result.innerHTML = dataFromMain;
    }).catch(e => {
      result.innerHTML = e.message;
    })
})

subscribeAction.addEventListener('click', () => {
  const actionTypeValue = actionType.value;

  subscribe(actionTypeValue as any, (data) => {
    result.innerHTML = data;
  })
})

handle('_multiply', ({ firstNumber, secondNumber }) => {  
  return firstNumber * secondNumber;
})

callMethodInMainWindow.addEventListener('click', () => {
  send(
    '_subtract',
    { firstNumber: Number(firstNumber.value), secondNumber: Number(secondNumber.value)},
  ).then((result) => {
    methodResult.innerHTML = result.toString();
  })
})