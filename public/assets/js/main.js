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
api.setEventHandler((events) => {
  console.log(queue.size());
  if (queue.size() == 0) {
    events.map((e) => {
      queue.enqueue(e);
    });
  } else {
    startQueue();
  }
});
function startQueue() {
  console.log(queue.items);
  queue.items.map((e, i) => {
    if (e.type == API_EVENT_TYPE.MESSAGE) {
      addMessage(e);
      queue.dequeue();
    } else if (e.type == API_EVENT_TYPE.ANIMATED_GIFT) {
      if (isPossiblyAnimatingGift()) return;
      animateGift(e);
      queue.dequeue();
    } else {
      addMessage(e);
      queue.dequeue();
    }
  });
}
// NOTE: UI helper methods from `dom_updates` are already imported above.
