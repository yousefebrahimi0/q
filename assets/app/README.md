# Product screenshots for the live demos

Drop the five GreenRah screenshots here with these exact names. Until a file exists, the deck draws a stylised map in its place, so nothing breaks.

| File | Used on | Content |
|---|---|---|
| `lisbon-3d.webp` | Slide 4, Heat smart | Lisbon 3D, Coolest vs Fastest, WC pins (Igreja do Menino Deus → 15 Travessa do Barbosa, 19 Oct 13:55) |
| `lisbon-3d-base.webp` | Slide 4, under the route reveal | Same frame with the coloured route strokes removed |
| `barcelona-3d.webp` | Slide 5, Accessible result | Barcelona 3D, Gentle vs Fastest |
| `barcelona-3d-base.webp` | Slide 5, under the route reveal | Same frame with the coloured route strokes removed |
| `plan-heat.webp` | reference | Plan panel, Heat smart (green) |
| `plan-accessible.webp` | reference | Plan panel, Accessible (blue), "Find gentle walk" |
| `barcelona-result.webp` | reference | Barcelona result card: 18 °C, UV 1, water on path, 5.1 km, 1 h 6 m, 60% shade |

The Plan panel on slide 5 is rebuilt in HTML from the plan screenshots so the Heat smart → Accessible switch animates smoothly.

After adding the 3D images, open `index.html?trace#/4` (or `#/5`), click along the green route in the image, and copy the `d="M..."` line from the browser console into the matching `<path class="route green">` in `index.html` (same for the red route). That makes the SVG path draw sit exactly on the streets.
