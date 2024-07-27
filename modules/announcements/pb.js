const pb = new PocketBase("http://127.0.0.1:8090/");

await pb.admins.authWithPassword(
  "james.chen41@education.nsw.gov.au",
  "xFi7P&Fiq7k,2'z"
);

let stack = [];

// Fetch announcements
const announcementsRaw = await pb.collection("announcements").getFullList({
  sort: "-created",
  filter: "validUntil != null && validUntil > @now",
});

// Announcements stats
let count = Number(announcementsRaw.length);
let pos = Number(localStorage.getItem("pos"));

// If not declared, declare
if (
  localStorage.getItem("count") == undefined ||
  localStorage.getItem("pos") == undefined
) {
  localStorage.setItem("count", count);
  localStorage.setItem("pos", 0);
}

// Begin the cycle again
if (pos >= count) {
  localStorage.setItem("pos", 0);
  pos = 0;
}

// Process announcements
function processAnnouncement(x) {
  const title = x.title;
  const msg = x.message;
  const img =
    "http://127.0.0.1:8090/api/files/" +
    x.collectionId +
    "/" +
    x.id +
    "/" +
    x.img;
  new ann(title, msg, img);
}

class ann {
  constructor(title, message, image) {
    this.title = title;
    this.message = message;
    this.image = image;
    stack.push(this);
  }
  destruct() {
    this.title = null;
    this.message = null;
    this.image = null;
    this.void;
    this.destruct();
  }
}

// Subscribe to changes
pb.collection("announcements").subscribe("*", function (e) {
  console.log("Change detected. Reloading to apply changes...");
  location.reload();
});

console.log(`There is/are ${count} active announcement(s).`);
processAnnouncement(announcementsRaw[pos]);

// Update position in cycle
localStorage.setItem("pos", pos + 1);
console.log(localStorage.getItem("pos"));
pos++;

export default stack;