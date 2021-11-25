import './style.css'
import { handle, publish, send } from '../../src/channel';

const listenToActionButton = document.getElementById('listenToAction')
const publishAction = document.getElementById('publishAction')
const actionType = document.getElementById('actionType')! as HTMLInputElement
const result = document.getElementById('result')!;
const responseData = document.getElementById('responseData')! as HTMLTextAreaElement;

const callMethodInIframe = document.getElementById('callMethodInIframe');
const firstNumber = document.getElementById('firstNumber')! as HTMLInputElement
const secondNumber = document.getElementById('secondNumber')! as HTMLInputElement
const methodResult = document.getElementById('methodResult')!;

const iFrame = document.querySelector('iframe') as HTMLIFrameElement;

listenToActionButton?.addEventListener('click', () => {
  const actionTypeValue = actionType.value;
  const reponseDataValue = responseData.value;

  handle(actionTypeValue as any, (receivedData) => {
    result.innerHTML += JSON.stringify(receivedData) + '\n';

    return reponseDataValue;
  })
})

publishAction?.addEventListener('click', () => {
  const actionTypeValue = actionType.value;
  const reponseDataValue = responseData.value;

  publish(actionTypeValue as any, reponseDataValue)
})

handle('_subtract', ({ firstNumber, secondNumber }) => {  
  return firstNumber - secondNumber;
})

callMethodInIframe.addEventListener('click', () => {
  send(
    '_multiply',
    { firstNumber: Number(firstNumber.value), secondNumber: Number(secondNumber.value)},
    iFrame.contentWindow
  ).then((result) => {
    methodResult.innerHTML = result.toString();
  })
})