# My room

A small HTML + CSS website with an interactive room, a few popups, and a browser that always finds the same thing. The supplied artwork is temporary SVG artwork; replace it with your own drawings whenever you are ready.

## Start here

1. Extract the entire ZIP. Do not open the website from inside the ZIP preview.
2. Open `my-room/index.html` in a current browser.
3. Click the room objects or the shortcut buttons below the room.
4. Open the **whole `my-room` folder** in VS Code to edit it.
5. Start with **`config.js`**. Most changes only need that one file.
6. Save your edits and refresh the browser.

There is no npm install, build step, framework, API key, database, or paid service. The default project works offline. JavaScript is used for popups, content rendering, and the pretend search. The search does not send queries anywhere.

If you already use VS Code Live Server, you can also open `index.html` with it. A local server is optional. To share the site later, upload the contents of `my-room` to a static web host, with `index.html` at the published root. No hosting-specific files are required.

## What each object does

| Object | Behavior | Edit in `config.js` |
| --- | --- | --- |
| Bookshelf | Opens the note “i dont read any books lol” | `bookshelf` |
| Cats | Opens a gallery of your cat photos | `cats.photos` |
| Table | Decoration only; clicking it does nothing | `artwork.objects.table` |
| Monitor | Opens a pretend browser. Every non-empty search shows exactly the same configured result | `monitor.result` |
| Bed | Opens a photo of your blanket | `bed.photo` |
| PC | Opens a list of specifications | `pc.specs` |
| To-do board | Opens separate Hack Club workshops and YSWS lists | `board.workshops`, `board.ysws` |
| Window | Opens a gallery of outdoor photos | `window.photos` |

Photos and PC specs are deliberately empty placeholders. The workshop and YSWS arrays start empty. No photos, specs, or participation claims have been invented for you.

## File structure

Every path below is inside the extracted `my-room` folder.

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure: header, hero, room frame, shortcuts, footer, and one reusable popup |
| `styles.css` | Colors, typography, layout, clickable-object styles, popup styles, and responsive rules |
| `config.js` | Your editable text, image paths, click-area positions, search result, specs, and lists |
| `script.js` | Creates the clickable objects and renders their popups using your configuration |
| `README.md` | This guide |
| `assets/favicon.svg` | Small house icon used in the browser tab and page header |
| `assets/room/background.svg` | Temporary 1920 × 1080 wall/floor background |
| `assets/room/window.svg` | Temporary window artwork |
| `assets/room/bookshelf.svg` | Temporary bookshelf artwork |
| `assets/room/table.svg` | Temporary desk artwork |
| `assets/room/monitor.svg` | Temporary monitor artwork |
| `assets/room/pc.svg` | Temporary PC artwork, also used as a decoration in the specs popup |
| `assets/room/board.svg` | Temporary to-do board artwork |
| `assets/room/bed.svg` | Temporary bed artwork |
| `assets/room/cats.svg` | Temporary two-cat artwork |
| `assets/photos/cats/` | Put your actual cat pictures here |
| `assets/photos/blanket/` | Put your blanket picture here |
| `assets/photos/outdoors/` | Put your outdoor pictures here |
| `assets/photos/*/PUT-…-HERE.txt` | Small reminders keeping the empty photo folders in the ZIP; safe to delete |
| `reference/layout-sketch.png` | Your original layout sketch, included for reference; not loaded by the site |

All website paths are relative to `index.html`. Use `/` in paths even on Windows. Prefer lowercase filenames without spaces, and match capitalization exactly.

## Add your drawings

There are two supported ways to draw the room. The supplied version uses separate layers.

### Option A: background plus separate objects

Use this if you want each object to have its own image and hover effect.

1. Draw your empty room background in Krita, ideally at **1920 × 1080**.
2. Export it as PNG or WebP into `assets/room/`, for example `my-background.png`.
3. Export each object separately with a **transparent background**. Use a crop that contains just that object, not a whole 1920 × 1080 transparent canvas.
4. Put those exported files in `assets/room/`.
5. Keep `artwork.mode` set to `"layers"`.
6. Set `artwork.background` to `"assets/room/my-background.png"`.
7. Change each object’s `image` path to your file.

For example, replace the existing monitor entry with:

```js
monitor: {
  image: "assets/room/my-monitor.png",
  x: 37, y: 43, w: 14, h: 18, z: 5
},
```

The object image fills its configured rectangle. If it looks stretched, adjust `w` and `h` to match its proportions. Keep a little transparent padding if your drawing needs breathing room. The specs popup automatically reuses the image path from `artwork.objects.pc.image`; the original `pc.svg` is a fallback if that path is empty.

You can retain any placeholders while you finish your art. In layers mode, setting an object’s `image` to `""` leaves its clickable area in place without a separate drawing, which also allows a mixed approach.

### Option B: one complete room picture

Use this if the background already contains your window, bookshelf, PC, cats, and everything else.

1. Export the complete room picture into `assets/room/`, for example `finished-room.png`.
2. Set these values inside `artwork`:

```js
mode: "flat",
background: "assets/room/finished-room.png",
width: 1920,
height: 1080,
```

The separate object drawings disappear automatically. Invisible buttons remain on top of the same parts of the picture. The table stays non-interactive. No need to edit HTML or erase the separate object configuration.

For a differently shaped canvas, update `width` and `height` to your actual drawing size. These numbers control the room’s aspect ratio. Recheck all click areas afterward. Avoid adding CSS cropping or `object-fit: cover` to the background: the picture and its click areas need to scale together.

## Position the click areas

The numbers in `artwork.objects` match the approximate layout in your sketch. Each rectangle also places its image in layers mode.

| Property | Meaning |
| --- | --- |
| `x` | Left edge, as a percentage of the room’s width |
| `y` | Top edge, as a percentage of the room’s height |
| `w` | Rectangle width, as a percentage of the room’s width |
| `h` | Rectangle height, as a percentage of the room’s height |
| `z` | Stack order: a larger number appears in front |
| `image` | Path to that object’s drawing; ignored in flat mode |

To align a finished background:

1. Set `debugHotspots: true` in `config.js` and refresh.
2. Pink outlines show the clickable rectangles. The green outline is the non-interactive table.
3. Adjust the numbers until each rectangle covers its object.
4. Save and refresh after each adjustment.
5. Set `debugHotspots: false` when finished.

Convert Krita pixel coordinates to percentages with:

```text
x = left pixel position / canvas width × 100
y = top pixel position / canvas height × 100
w = object pixel width / canvas width × 100
h = object pixel height / canvas height × 100
```

For example, an object starting at pixel 960 on a 1920-pixel-wide canvas has `x: 50`. Keep `x + w` and `y + h` at or below 100 unless you intentionally want an object cut off at the edge. If two buttons overlap, the higher `z` receives the click. The PC intentionally sits in front of a small part of the board, as in the sketch.

The scene keeps one aspect ratio, so the rectangles remain aligned when the browser resizes. On phones, large shortcut buttons provide an easier alternative to tapping small objects. “Show labels” is a visitor-facing control; `debugHotspots` is for you while editing.

## Add your photos

Copy your images into the appropriate folders, then replace the empty entries. For example, replace the existing `cats.photos` array with:

```js
photos: [
  {
    src: "assets/photos/cats/milo.jpg",
    alt: "Milo curled up on my desk",
    caption: "supervising my work"
  },
  {
    src: "assets/photos/cats/luna.png",
    alt: "Luna looking out of the window",
    caption: "birdwatching department"
  }
]
```

These names are examples, not included photos. Add as many entries as you want. `alt` describes the image for screen readers. `caption` appears under it. Images fit inside their frames without cropping.

For the bed, change the existing `photo` object:

```js
photo: {
  src: "assets/photos/blanket/my-blanket.jpg",
  alt: "My blanket spread across the bed",
  caption: "the best blanket"
}
```

Outdoor pictures use the same array format as cats, inside `window.photos`. An empty `src` shows “photo coming soon”; a bad path shows “This photo couldn’t load.” An empty gallery array shows a short empty-state message. These are display galleries, not visitor upload controls: you add files to the project yourself.

## Set the browser’s one search result

Edit the existing `monitor.result` object:

```js
result: {
  title: "look at this cat",
  description: "Whatever you searched for, this is the answer.",
  displayUrl: "the-internet / definitely-a-cat",
  url: "",
  linkLabel: "open it",
  image: "assets/photos/cats/milo.jpg",
  imageAlt: "Milo looking at the camera"
}
```

You control the title, description, displayed address, optional link, and optional image. `displayUrl` is just text. `url` is the actual destination: set it to a real `https://…` URL or a relative page if you want a link. An empty `url` hides the link; an empty `image` hides the result image. Normal destination links open a new tab; a hash such as `#room` closes the popup and jumps within the page.

Every non-empty search reveals this same result. Pressing Enter and pressing the arrow button do the same thing. Whitespace-only searches are rejected. The typed query never changes the result, contacts a search engine, or gets saved. Closing and reopening the monitor resets the search view. Text is treated as text, so you do not need to write HTML in the configuration.

## Add your PC specs

Replace values in `pc.specs`. You can add or remove rows:

```js
specs: [
  { label: "CPU", value: "Your processor" },
  { label: "GPU", value: "Your graphics card" },
  { label: "Memory", value: "Your RAM" },
  { label: "Storage", value: "Your SSD or hard drive" }
]
```

## Add workshops and YSWS programs

Change the arrays inside `board`. Here is an example format:

```js
workshops: [
  {
    title: "Vibes",
    description: "Making this room website.",
    status: "In progress",
    url: ""
  }
],
ysws: [
  {
    title: "A program I want to try",
    description: "My idea for it.",
    status: "On my list",
    url: ""
  }
]
```

Replace the examples with your own details. `title` is the heading; `description`, `status`, and `url` are optional. An empty URL creates no link. Status is a display label, not a clickable checkbox. The website does not track or sync submissions.

## Understand the HTML

`index.html` contains the permanent page structure. The header links jump to parts of this page. The hero contains the heading, room toolbar, scene, caption, and shortcut navigation. The scene starts with just a background image; JavaScript adds the objects using `config.js`.

The native `<dialog>` at the bottom is reused for every popup. `#dialog-content` is replaced when an object opens. The close button, header, and footer remain in place. The skip link lets keyboard users jump straight to the shortcuts. The `<noscript>` message explains why popups cannot work if JavaScript is disabled.

The `config.js` script tag must come before `script.js`. Both use `defer`, so they execute in order after HTML parsing. They are classic scripts rather than JavaScript modules, so opening the file directly does not need a server. Change the main welcome heading in `index.html`; the tab title, wordmark, and introduction are in `config.site`.

## Understand the CSS

`styles.css` is divided into eight numbered sections:

1. **Shared styles:** `:root` holds colors and font choices. The fonts are built-in system fonts, with no external font request.
2. **Header and intro:** aligns navigation and sizes the welcome heading.
3. **Scene:** `.room-scene` is the positioning parent; `.room-object` uses absolute percentage coordinates. Object images fill their rectangles. Hover and keyboard focus highlight objects. The `flat-art`, `show-labels`, and `debug-hotspots` classes enable the different display modes.
4. **Shortcuts and footer:** wrapping buttons below the scene remain easy to use on touchscreens.
5. **Popup frame:** styles the dialog, backdrop, close button, and scrollable content.
6. **Popup contents:** styles the bookshelf note, photo frames, spec list, and workshop columns.
7. **Pretend browser:** styles the input, search button, and fixed result.
8. **Responsive rules:** adjusts spacing and layouts below 1000px and 600px, and respects reduced-motion preferences.

The background is never cropped: it fills the exact scene rectangle. The scene’s proportions are set by `artwork.width` and `artwork.height`, and each click area uses that same rectangle. The popup can scroll on short screens. Photo and workshop grids collapse to a single column on narrow screens.

## Understand the JavaScript

`config.js` defines `window.ROOM_CONFIG`, one object containing your settings. `script.js` runs inside an immediately invoked function so its internal variables do not become global variables.

| Function or section | What it does |
| --- | --- |
| `items` | Maps the seven interactive IDs to labels and rendering functions; the table is intentionally absent |
| `element()` | Creates an HTML element, adds a class, and inserts text safely using `textContent` |
| `safeURL()` | Accepts web URLs and local relative paths while rejecting executable URL schemes |
| `addLink()` | Adds a link only when a valid destination exists; handles new tabs or an in-page jump |
| `makeHeading()` | Adds a popup’s small label, title, and description with the IDs used by its accessibility labels |
| `setLabels()` | Shows or hides object labels and updates the toggle’s pressed state |
| `buildRoom()` | Applies site settings, sets the background and aspect ratio, positions objects, and creates shortcut buttons |
| `openItem()` | Remembers the clicked button, clears the previous content, renders the selected view, and opens the dialog |
| `renderBookshelf()` | Displays your bookshelf message on a small paper note |
| `photoPlaceholder()` | Creates the camera icon and empty/broken-photo message |
| `photoCard()` | Creates one photo frame, caption, alt text, and image-error fallback |
| `photoGallery()` | Arranges a collection of frames or displays an empty-gallery message |
| `renderCats()`, `renderWindow()`, `renderBed()` | Supply each popup’s configured text and photos to the shared gallery functions |
| `renderPC()` | Builds a semantic definition list from the specifications |
| `renderBoard()` | Builds the two workshop/program columns from their arrays |
| `renderMonitor()` | Creates a search form and the configured result; submitting reveals that result without a network request |
| Document click handler | Uses `data-item` to open the same view from either a scene object or a shortcut |
| Backdrop handlers | Close the dialog only when a pointer press and click both happen outside its rectangle |
| Dialog close handler | Unlocks background scrolling and restores keyboard focus to the original button |

The native dialog keeps focus inside while open and handles Escape. The close button is initially focused so phones do not open their keyboard immediately. All configuration text is inserted with `textContent`; HTML-like text is displayed literally instead of executed.

## Common edits and troubleshooting

| If you want to… | Do this |
| --- | --- |
| Change the overall colors | Edit the variables at the top of `styles.css` |
| Change the main heading or footer | Edit the text in `index.html` |
| Change the tab name or intro sentence | Edit `config.site` |
| Change an object’s short label | Edit its `label` in the `items` map in `script.js` |
| Change a popup heading or description | Edit that object’s section in `config.js` |
| Keep labels visible on first load | Set `artwork.showLabels` to `true` |
| Show a complete drawing without duplicate furniture | Set `artwork.mode` to `"flat"` |
| Fix an object that catches another object’s clicks | Adjust its rectangle or `z` value |
| Fix a photo that will not load | Check its filename, capitalization, extension, and path; then refresh |
| Fix a blank room after editing config | Look for a missing comma, quote, bracket, or brace in `config.js` |
| See updated art after replacing a file | Save it, then hard-refresh the page (Ctrl+Shift+R on Windows) |

Adding an image file alone does not add it to a gallery: you must add its path to the corresponding configuration entry. Use the browser’s developer console for syntax errors if edits stop the JavaScript from running. You can always compare against the original ZIP.

## Check before sharing

- Open each scene object and each shortcut. The table should do nothing.
- Search two completely different things; both should return your chosen result.
- Check the close button, Escape, and clicking outside the popup.
- Confirm every photo path works and your placeholder PC values are replaced.
- Resize the browser and check that the room stays aligned and shortcuts wrap.
- Turn `debugHotspots` off after aligning your art.
- Keep the entire `assets` folder alongside the HTML, CSS, and JavaScript.

The default interactions have been checked in a browser. Your future images and links will need checking after you add them.
