const isArr = Array.isArray;
const toArray = (arr) => (isArr(arr ?? []) ? arr : [arr]);
const isText = (text) => typeof text === "string" || typeof text === "number";
const flatten = (arr) => [
  ...arr.map((ar) =>
    isArr(ar) ? [...flatten(ar)] : isText(ar) ? createTextNode(ar) : ar
  ),
];

function h(type, props, ...kids) {
  props = props ?? {};
  kids = flatten(toArray(props.children ?? kids)).filter(Boolean);
  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids;

  const key = props.key ?? null;
  const ref = props.ref ?? null;

  delete props.key;
  delete props.ref;

  return createVNode(type, props, key, ref);
}

function createTextNode(text) {
  return {
    type: "",
    props: { nodeValue: text + "" },
  };
}

function createVNode(text) {
  return {
    type,
    props,
    key,
    ref,
  };
}

export function Fragment(props) {
  return props.children;
}

// scheduler
// IDLE requestIdleCallback 50ms渲染问题
// postMessage event-loop
const queue = [];
const threshold = 1000 / 60;
// git transitions
const transitions = [];
let deadline = 0;

const now = () => performance.now();
const peek = (arr) => arr[0];

export function sholudYield() {
  return navigator.scheduling.isInputPending() || now() >= deadline;
}

export function scheduler(cb) {
  queue.push({ cb });

  // todo
  statrtTranstion(flush);
}

const postMessage = (() => {
  const cb = () => transitions.slice(0, 1).forEach((c) => c());
  const { port1, port2 } = new MessageChannel();
  port1.onmessage = cb;
  return () => port2.postMessage(null);
})();

export function statrtTranstion(cb) {
  queue.push({ cb }) && postMessage();
}

function flush() {
  deadline = now() + threshold;
  let task = peek(queue);

  while (task && !sholudYield()) {
    const { cb } = task;
    task.cb = null;
    const next = cb();

    if (next && typeof next === "function") {
      task.cb = next;
    } else {
      queue.shift();
    }

    task = peek(queue);
  }

  task && statrtTranstion(flush);
}
