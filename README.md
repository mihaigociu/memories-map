# Memories Map

An interactive map of Europe where students can share travel memories — photos, videos, and written reflections — pinned to the places they visited.

Built for classroom use: the teacher maintains the content by editing a single JSON file and dropping media files into one folder. No database, no login system, no cloud services required.

---

## What it looks like

- An interactive map of Europe loads in the browser
- Each place a student has visited appears as a pin on the map
- Clicking a pin opens a side panel showing all memories for that place: text stories, photos, and video clips
- Media can be local files (photos/videos handed in by students) or external URLs and YouTube embeds

---

## Project structure

```
memories-map/
├── server.js              # Express server — serves static files and the places API
├── package.json
├── data/
│   └── places.json        # All map pins and student memories live here
└── public/
    ├── index.html         # Single-page app shell
    ├── style.css          # Layout and card styles
    ├── app.js             # Map logic and panel rendering
    └── uploads/           # Local photo and video files go here
```

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or later

That's it. No database, no build step, no environment variables.

---

## Setup and installation

**1. Clone or download the project**

```bash
git clone <repository-url>
cd memories-map
```

**2. Install dependencies**

```bash
npm install
```

This installs Express, the only dependency.

**3. Run the server**

```bash
npm start
```

**4. Open the app**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Adding content

All content is managed through two things: the `data/places.json` file and the `public/uploads/` folder.

### Adding a new place

Open `data/places.json` and add a new entry to the `places` array:

```json
{
  "id": "london",
  "name": "Tower of London",
  "lat": 51.5081,
  "lng": -0.0759,
  "memories": []
}
```

`lat` and `lng` are decimal coordinates. You can find them by right-clicking any location on [Google Maps](https://maps.google.com) and selecting "What's here?".

### Adding a text memory

```json
{
  "student": "Ana",
  "type": "text",
  "content": "We crossed Tower Bridge at sunrise. The Thames was completely still."
}
```

### Adding a photo — local file

1. Drop the photo into `public/uploads/` (JPG, PNG, WebP all work)
2. Reference it by filename:

```json
{
  "student": "Dan",
  "type": "photo",
  "file": "london_bridge.jpg",
  "caption": "Tower Bridge at sunrise"
}
```

### Adding a photo — external URL

If you have a direct link to an image online (e.g. from Wikimedia Commons), use `url` instead of `file`:

```json
{
  "student": "Dan",
  "type": "photo",
  "url": "https://upload.wikimedia.org/wikipedia/commons/.../tower_bridge.jpg",
  "caption": "Tower Bridge at sunrise"
}
```

### Adding a video — local file

1. Drop the video into `public/uploads/` (MP4 and WebM have the best browser support)
2. Reference it:

```json
{
  "student": "Maria",
  "type": "video",
  "file": "london_walk.mp4",
  "caption": "A walk along the South Bank"
}
```

> **Tip:** If a student sends you a `.mov` file (iPhone), convert it to `.mp4` first for reliable browser playback. On a Mac you can do this by opening it in QuickTime Player → File → Export As → 1080p.

### Adding a YouTube video

```json
{
  "student": "Radu",
  "type": "youtube",
  "videoId": "dQw4w9WgXcQ",
  "caption": "A tour of the city"
}
```

The `videoId` is the part after `?v=` in any YouTube URL. For example, for `https://www.youtube.com/watch?v=dQw4w9WgXcQ` the ID is `dQw4w9WgXcQ`.

---

## Full example — a complete place entry

```json
{
  "id": "london",
  "name": "Tower of London",
  "lat": 51.5081,
  "lng": -0.0759,
  "memories": [
    {
      "student": "Ana",
      "type": "text",
      "content": "We crossed Tower Bridge at sunrise. The Thames was completely still."
    },
    {
      "student": "Dan",
      "type": "photo",
      "file": "london_bridge.jpg",
      "caption": "Tower Bridge at sunrise"
    },
    {
      "student": "Maria",
      "type": "video",
      "file": "london_walk.mp4",
      "caption": "A walk along the South Bank"
    },
    {
      "student": "Radu",
      "type": "youtube",
      "videoId": "dQw4w9WgXcQ",
      "caption": "A tour of the city"
    }
  ]
}
```

---

## How it works (technical overview)

1. **Server (`server.js`)** — a minimal Express app that does two things: serves everything in `public/` as static files, and exposes a `GET /api/places` endpoint that reads and returns `data/places.json`.

2. **Map (`public/app.js`)** — on page load, the browser fetches `/api/places`. For each place, a [Leaflet.js](https://leafletjs.com/) marker is placed on the map. Clicking a marker calls `openPanel()`, which builds HTML cards for each memory and injects them into the side panel.

3. **Media rendering** — the `renderMemory()` function in `app.js` handles all four memory types:
   - `text` → plain paragraph
   - `photo` → `<img>` tag, using `file` (served from `/uploads/`) or `url` (external link)
   - `video` → `<video>` tag with `controls`, same `file`/`url` logic
   - `youtube` → responsive `<iframe>` embed using the `videoId`

4. **Map tiles** — the map background comes from [OpenStreetMap](https://www.openstreetmap.org/) via Leaflet. No API key is needed.

---

## Supported media formats

| Type | Recommended formats | Notes |
|------|-------------------|-------|
| Photo | `.jpg`, `.png`, `.webp` | Any size works; large files will just load slower |
| Video | `.mp4`, `.webm` | MP4 (H.264) has the widest browser support |
| YouTube | any YouTube URL | Extract the `videoId` from the URL |

---

## Changing the port

The server runs on port 3000 by default. To use a different port, edit the `PORT` constant at the top of `server.js`:

```js
const PORT = 8080;
```
