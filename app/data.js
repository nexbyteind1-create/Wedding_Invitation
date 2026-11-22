export const COUPLE = {
  groom: "Gaddam Sai Dheekshit",
  groomParents: "Gaddam Raji Reddy & Gaddam Sulochana",
  bride: "Kashan Tejaswi",
  brideParents: "Kashan Venu Gopal & Kashan Sandhya Rani",
  short: "Sai Dheekshit & Tejaswi",
};

export const WEDDING = {
  iso: "2026-11-26T09:29:00+05:30",
  day: "Thursday",
  date: "26 November 2026",
  time: "Pheras at 9:29 AM",
  venue: "Zoroastrian Club",
  address: "Zoroastrian Club, Secunderabad",
  maps: "https://share.google/GqCMpBFAQfBC2S1Jc",
  directions: "https://www.google.com/maps/dir/?api=1&destination=Zoroastrian+Club+Secunderabad",
  calendar:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sai+Dheekshit+%26+Tejaswi+Wedding&dates=20261126T035900Z/20261126T073000Z&location=Zoroastrian+Club,+Secunderabad&details=Pheras+at+9:29+AM",
};

export const EVENTS = [
  { key: "sangeet", name: "Sangeet", icon: "💃", day: "Monday", date: "23 November 2026" },
  { key: "haldi", name: "Haldi", icon: "🌼", day: "Wednesday", date: "25 November 2026", dress: "Wear yellow", swatch: "#f2c230" },
  { key: "pheras", name: "Baraat & Pheras", icon: "🔥", day: "Thursday", date: "26 November 2026", time: "Pheras at 9:29 AM" },
];

export const RECEPTION = { day: "Sunday", date: "29 November 2026", time: "7:00 PM" };

export const STORY = [
  "The two of us",
  "Two rings, one promise",
  "Blessed in garlands",
  "His happiest smile",
  "A flower for her hair",
  "The ring exchange",
  "Our first cake together",
  "Sweet beginnings",
  "Family, always",
  "Forever starts here",
].map((caption, i) => ({ src: `/photos/${i + 1}.jpg`, caption }));

export const PRELOAD = [...STORY.map((s) => s.src), "/photos/1-blur.jpg", "/ganesh.svg", "/rose.svg", "/petal.svg", "/marigold.svg"];
