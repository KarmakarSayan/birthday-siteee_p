# Pragya's 23rd birthday website

This is a static multi-page site made with HTML, CSS, and JavaScript. Open `index.html` in a browser to preview. The same folder can be deployed to Vercel as a static site.

## Files

- `index.html` — birthday homepage
- `memories.html` — photo gallery
- `letter.html` — birthday letter
- `cake.html` — interactive cake with 23 candles
- `style.css` — shared styles and animations
- `script.js` — sparkle effects, photo paths, and candle interaction
- The cake page ends with a voice-note player. It uses the temporary sample in `assets/myAudio.wav`; replace that file with your own voice recording under the same name. Playback is manual and appears only at the end of the birthday experience.
- The homepage includes an interactive gift reveal, and the cake page remembers when its one-time candle wish has been made.
- The memories page is a keyboard- and touch-friendly photo carousel that advances every 3 seconds. Use the previous/next arrows to move either way, or pause and resume the slideshow.
- The homepage features an animated heart tree using `assets/flying-heart-filled-heart-2.png`, with one photo (`cover`) in its center, five animated reasons she is special, and a photo puzzle that uses the cover photo by default.
- Every page includes an original, synthesized birthday tune and attempts to start it automatically. Browsers that block autoplay start the tune after the visitor's first tap, click, or key press anywhere on the page.
- Every page has pastel section ornaments, drifting balloons, and continuous falling hearts and petals.

## Add your voice note

Replace `assets/myAudio.wav` with your voice recording, keeping the exact filename and WAV format. The player is at the end of `cake.html`; visitors press play when they are ready to listen. If your recording uses another format, update the `<source>` in `cake.html` to match its filename and MIME type.

## Add photos

Put photos in the existing `assets` folder beside the HTML files. The 13 photos currently in that folder are already connected: `cover` appears in the puzzle and in the heart tree; `memory-1` through `memory-12` appear in the Memories carousel. Memory photos are fitted inside their frames without cropping. To replace or add a photo, copy it into `assets` and update the matching path in the `photos` object near the top of `script.js`:

```js
cover: "assets/pragya-cover.jpg",
"memory-1": "assets/memory-1.jpg",
"memory-2": "assets/memory-2.jpg",
// Continue through memory-12; letter can use any extra portrait.
letter: "assets/letter-photo.jpg"
```

Keep the paths relative to the project folder, including the `assets/` prefix. Use the matching keys `cover`, `memory-1` through `memory-12`, and `letter`. The heart tree displays only the `cover` photo; change `cover` in `script.js` to choose a different image for both the tree and default puzzle. Keep `flying-heart-filled-heart-2.png` in `assets` as the tree's heart base. Replace the sample captions and birthday letter with your personal details before sharing the site.
