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
let count = announcementsRaw.length;

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
  announcementsRaw.shift();
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
let i = count;
for (i > 0; i--;) {
  processAnnouncement(announcementsRaw[0]);
}

await i == 0;

export default stack;