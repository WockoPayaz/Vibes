/*
 * START HERE. Personalize the website in this file.
 * Use quotes for text and paths. Keep commas between entries.
 * All paths are relative to index.html. No uploads or accounts are needed.
 */
window.ROOM_CONFIG = {
  site: {
    name: "my room",
    title: "My room · a little corner of the internet",
    intro: "A little corner of the internet, full of my favorite things."
  },

  artwork: {
    // "layers": background + separate transparent object images.
    // "flat": one complete background with the objects already drawn into it.
    mode: "layers",
    background: "assets/room/background.svg",
    // Keep your finished drawing at 1920 × 1080, or update BOTH numbers here.
    width: 1920,
    height: 1080,
    // Shows outlined click areas for positioning your own art. Turn off when done.
    debugHotspots: false,
    showLabels: false,

    // x/y = distance from the LEFT/TOP, as percentages of the whole room.
    // w/h = width/height, as percentages. z = stack order (higher is in front).
    // Replace each image path with your transparent PNG/WebP/SVG.
    objects: {
      window:    { image: "assets/room/window.svg",    x: 2,    y: 4,  w: 27, h: 39, z: 2 },
      bookshelf: { image: "assets/room/bookshelf.svg", x: 2,    y: 55, w: 26, h: 32, z: 3 },
      table:     { image: "assets/room/table.svg",     x: 32,   y: 52, w: 36, h: 33, z: 2 },
      monitor:   { image: "assets/room/monitor.svg",   x: 37,   y: 43, w: 14, h: 18, z: 5 },
      pc:        { image: "assets/room/pc.svg",        x: 57.5, y: 35, w: 8,  h: 25, z: 6 },
      board:     { image: "assets/room/board.svg",     x: 60,   y: 11, w: 19, h: 29, z: 1 },
      bed:       { image: "assets/room/bed.svg",       x: 71,   y: 43, w: 29, h: 57, z: 4 },
      cats:      { image: "assets/room/cats.svg",      x: 7,    y: 84, w: 11, h: 15, z: 7 }
    }
  },

  bookshelf: {
    title: "my very impressive library",
    message: "i dont read any books lol"
  },

  cats: {
    title: "the actual owners of this room",
    description: "My cats, in all their glory.",
    // Add as many entries as you like. Replace these empty examples with real files.
    photos: [
      { src: "", alt: "A photo of my first cat", caption: "cat no. 01" },
      { src: "", alt: "A photo of my second cat", caption: "cat no. 02" }
      // Example: { src: "assets/photos/cats/milo.jpg", alt: "Milo asleep", caption: "sleeping on the job" }
    ]
  },

  monitor: {
    browserName: "the very small internet",
    searchPlaceholder: "Ask the internet anything…",
    // EVERY non-empty search returns this exact same result.
    result: {
      title: "You found my little corner of the internet.",
      description: "All roads lead back to this room. Even that one.",
      displayUrl: "my-room.local / hello",
      // Optional: a real https:// URL, a relative page, or #room. Empty = no link.
      url: "",
      linkLabel: "take a look",
      // Optional photo displayed inside the result. Leave empty to hide it.
      image: "",
      imageAlt: "My search result image"
    }
  },

  bed: {
    title: "a very important blanket",
    description: "Peak comfort. No further explanation needed.",
    photo: { src: "", alt: "My favorite blanket", caption: "the blanket, eventually" }
  },

  pc: {
    title: "what’s in the box?",
    description: "The little machine behind it all.",
    // Replace the values below with your own specs. Add or remove rows freely.
    specs: [
      { label: "CPU", value: "Not added yet" },
      { label: "GPU", value: "Not added yet" },
      { label: "Memory", value: "Not added yet" },
      { label: "Storage", value: "Not added yet" },
      { label: "Motherboard", value: "Not added yet" },
      { label: "OS", value: "Not added yet" }
    ]
  },

  board: {
    title: "things i’m up to",
    description: "A home for workshops, little projects, and things to try.",
    // Items can have: title, description, status, url (all strings).
    // Example: { title: "Vibes", description: "Making a room on the web.", status: "In progress", url: "" }
    workshops: [],
    ysws: []
  },

  window: {
    title: "a little fresh air",
    description: "A few things from the world outside.",
    photos: [
      { src: "", alt: "An outdoor photo", caption: "somewhere outside" },
      { src: "", alt: "Another outdoor photo", caption: "a moment worth keeping" }
    ]
  }
};
