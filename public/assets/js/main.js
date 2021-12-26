// @ts-check
import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import {
  addMessage,
  animateGift,
  isPossiblyAnimatingGift,
  isAnimatingGiftUI,
} from "./dom_updates.js";
import { Queue } from "./queue.js";

const api = new APIWrapper();
let queue = new Queue();
let sendedGift = false;

api.setEventHandler((events) => {
  const seen = new Set();
  const filteredArr = events.filter(filterEl => {
    const duplicate = seen.has(filterEl.id);
    seen.add(filterEl.id);
    return !duplicate;
  });
  filteredArr.map((e, i) => {
    if(e.type == API_EVENT_TYPE.ANIMATED_GIFT)
    queue.firstenqueue(e);
    else
    queue.enqueue(e);
  });
});

function startQueue() {
  if (queue.size() == 0) return;
  let data = queue.dequeue();
  if (getSecondDifference(data.timestamp) > 20) return;
  if (data.type == API_EVENT_TYPE.MESSAGE) {
    addMessage(data);
    sendedGift = false;
  } else if (data.type == API_EVENT_TYPE.ANIMATED_GIFT) {
    if (isPossiblyAnimatingGift()) return;
    animateGift(data);
    sendedGift = false;
  } else {
    if (!sendedGift) addMessage(data);
    sendedGift = true;
  }
}
setInterval(() => {
  startQueue();
}, 500);

function getSecondDifference(date) {
  var t1 = new Date(date);
  var t2 = new Date();
  var dif = t1.getTime() - t2.getTime();
  var t1ToT2 = dif / 1000;
  var between_Dates = Math.abs(t1ToT2);
  return Number(between_Dates.toFixed(0));
}
