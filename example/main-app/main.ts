import { on } from 'lib'
import './style.css'

const listenToActionButton = document.getElementById('listenToAction')
const actionType = document.getElementById('actionType')! as HTMLInputElement
const result = document.getElementById('result')!;
const responseData = document.getElementById('responseData')! as HTMLTextAreaElement;

listenToActionButton?.addEventListener('click', () => {
  const actionTypeValue = actionType.value;
  const reponseDataValue = responseData.value;

  on(actionTypeValue as any, (receivedData) => {
    result.innerHTML += JSON.stringify(receivedData) + '\n';

    return reponseDataValue;
  });
})