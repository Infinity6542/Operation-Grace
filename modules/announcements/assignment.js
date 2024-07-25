import stack from "./pb.js";

// Retrieving DOM elements
const x = document.getElementById("heading");
const y = document.getElementById("paragraph");
const z = document.getElementById("image");

// Creating class
// class Announcement {
//   constructor(title, paragraph, image) {
//     this.title = title;
//     this.par = paragraph;
//     this.img = image;
//   }
//   makeAnnouncement() {
//   }
// }

// Assign values to DOM elements
x.innerHTML = stack[0].title;
y.innerHTML = stack[0].message;
z.src = stack[0].image;