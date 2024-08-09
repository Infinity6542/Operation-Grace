//TODO: Implement announcements collection in PB
import stack from "/modules/announcements/pb.js";
import queue from "/core/lib/queue.js";

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

// Removes all classes from an element
function removeClasses(e) {
  var classList = e.classList;
  while (classList.length > 0) {
    classList.remove(classList.item(0));
  }
}

// Animation process
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

// Cycle function
// Doesn't actually cycle, calls the cycle function within the queue class
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

// Kills everything
function destruct() {
  console.info(
    "Self-destruct function initiated. Now destructing everything..."
  );
  window.alert("Self-destruct function initiated.");
  queue.destruct().then((e) => {
    console.error(e);
  });
  console.info("Self-destruction process completed.");
  console.info("Note that only the queue has been terminated.")
}

console.info(
  "Self-destruction function loaded successfully. Items may now be added to the queue."
);

// The below line creates a new queue. It is recommended to have one queue only.
const queue = new Queue();

//* TEST SCREENS
// Remove before putting into production
//TODO: Move test screens into the Modules collection implementation
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
