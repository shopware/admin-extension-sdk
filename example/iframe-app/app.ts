import './style.css';
import { send } from '../../src/channel';

const actionType = document.getElementById('actionType')! as HTMLInputElement
const actionValue = document.getElementById('actionValue')! as HTMLTextAreaElement
const sendAction = document.getElementById('sendAction')!;
const result = document.getElementById('result')!;

sendAction.addEventListener('click', () => {
  const actionTypeValue = actionType.value;
  const actionValueValue = actionValue.value;

  send(actionTypeValue as any, JSON.parse(actionValueValue))
    .then((dataFromMain) => {
      result.innerHTML = dataFromMain;
    })
})