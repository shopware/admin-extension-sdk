import './style.css'
import { handle } from '../../src/channel';

const listenToActionButton = document.getElementById('listenToAction')
const actionType = document.getElementById('actionType')! as HTMLInputElement
const result = document.getElementById('result')!;
const responseData = document.getElementById('responseData')! as HTMLTextAreaElement;

listenToActionButton?.addEventListener('click', () => {
  const actionTypeValue = actionType.value;
  const reponseDataValue = responseData.value;

  handle(actionTypeValue as any, (receivedData) => {
    result.innerHTML += JSON.stringify(receivedData) + '\n';

    return reponseDataValue;
  });
})