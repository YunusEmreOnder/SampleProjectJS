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
// NOTE: UI helper methods from `dom_updates` are already imported above.
