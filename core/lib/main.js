import stack from "/modules/announcements/pb.js";
// const pb = new PocketBase("http://127.0.0.1:8090/");

// await pb.admins.authWithPassword(
//   "james.chen41@education.nsw.gov.au",
//   "xFi7P&Fiq7k,2'z"
// );

console.log("%cWelcome to Operation Grace", "font-size: 20px;");
console.log("%cOperation Grace version 0.0.1", "color: #3780cc;");
console.log(
  "This is a demonstration/prototype of Operation Grace. Redistribution is strictly prohibited. Content you see on this page are not final."
);
console.log(
  "Core, by default, does not come with any modules. As a result, some modules have been provided for your convenience. Additional displays, such as the colour tests, have also been provided."
);
console.info("Now loading Operation Grace...");
console.log(
  "%c (c) Copyright 2024 James Chen. All Rights Reserved.",
  "color: #525259;"
);

console.info("Loaded successfully. Fetching DOM elements...");
console.log(console.memory);
const o1 = document.getElementById("0");
const o2 = document.getElementById("1");
console.info("DOM elements fetched successfully. Loading utility functions...");
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function removeClasses(e) {
  var classList = e.classList;
  while (classList.length > 0) {
    classList.remove(classList.item(0));
  }
}

function animate(x, y) {
  y.style.display = "";
  y.classList.add(x.anim + "_from");
  y.style.zIndex = 500;
  sleep(100).then(() => {
    y.classList.add(x.anim + "_to");
  });
  sleep(x.dur).then(() => {
    y.style.zIndex = 0;
  });
  sleep(x.dur + 2300).then(() => {
    y.style.display = "none";
    removeClasses(y);
  });
}

function cycle(x) {
  queue.cycle(x, queue.items[0]);
  if (queue.items[0].origin === "core") {
    animate(queue.items[0], x);
  } else {
    queue.items[0].dequeue();
  }
}

console.info(
  "Utility functions loaded successfully. Loading queue and core element..."
);

class Queue {
  constructor() {
    this.items = [];
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  destruct() {
    delete this.items;
    delete this.frontIndex;
    delete this.backIndex;
    delete this;
  }
  queue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    console.log(item + " added to queue");
    return item + " added to queue";
  }
  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }
  shuffle() {
    let currentIndex = this.items.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [this.items[currentIndex], this.items[randomIndex]] = [
        this.items[randomIndex],
        this.items[currentIndex],
      ];
    }
  }
  peek() {
    return this.items[this.frontIndex];
  }
  get printQueue() {
    return this.items;
  }
  cycle(x, e) {
    let arr = this.items;
    let y;
    let a = arr[0];
    if (x === o1) {
      y = o2;
      o1.src = e.src;
    } else if (x === o2) {
      y = o1;
      o2.src = e.src;
    } else {
      x = o1;
      y = o2;
      o1.src = e.src;
    }
    arr.push(arr.shift());
    let v = arr[0];
    if (a === v) {
      console.error(
        "Ugh. Something went wrong when pushing the array. Trying again..."
      );
      arr.push(arr.shift());
    }
    let temp = x;
    x = y;
    y = temp;
  }
}

class el {
  constructor(src, animation, duration) {
    this.origin = "core";
    this.src = src;
    this.anim = animation;
    this.dur = duration;
  }
}

console.info(
  "Queue and core elements loaded successfully. Loading the self-destruct function..."
);

function destruct() {
  console.info(
    "Self-destruct function initiated. Now destructing everything..."
  );
  window.alert("Self-destruct function initiated.");
  queue.destruct().then((e) => {
    console.error(e);
  });
  console.info("Self-destruction process completed.");
}

console.info(
  "Self-destruction function loaded successfully. Items may now be added to the queue."
);

// The below line creates a new queue. It is recommended to have one queue only.
const queue = new Queue();

//* TEST SCREENS
// Remove before putting into production
console.log(
  queue.queue(new el("/core/tests/blue.html", "slide_right_left", 10000))
);
console.log(queue.queue(new el("/core/tests/red.html", "scale", 10000)));
console.log(queue.queue(new el("/core/tests/green.html", "opacity", 10000)));
console.log(
  queue.queue(new el("/core/tests/yellow.html", "slide_left_right", 10000))
);

// Adding announcement screens to queue
for (let i = stack.length; i > 0; i--) {
  console.log(
    queue.queue(
      new el("/modules/announcements/announcements.html", "scale", 10000)
    )
  );
  // export default ann;
}

console.info("Beginning queue cycle.");

// Shuffle the queue. This step is optional.
queue.shuffle();

// Prematurely cycles the queue to start the cycle
cycle(o1);
sleep(10000).then(() => {
  cycle(o2);
});
// The actual cycle begins
window.setInterval(function () {
  cycle(o1);
}, 20000);
setTimeout(function () {
  window.setInterval(function () {
    cycle(o2);
  }, 20000);
}, 10000);

// export default queue;
