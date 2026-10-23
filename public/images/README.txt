PHOTOGRAPHY GALLERY PHOTOS
==========================
Put your client's photos in this folder and name them:

  img1.jpg  img2.jpg  img3.jpg  img4.jpg
  img5.jpg  img6.jpg  img7.jpg  img8.jpg

(.jpg, .jpeg, .png or .webp all work. If you use a different extension, change
the matching "image" path in src/data/content.js, in the photoGallery list.)

Tips
- Any shape is fine. Tiles crop the photo to fit; tapping a photo opens it
  full-size and uncropped.
- If the subject gets cut off in a tile, set "focus" for that photo in
  src/data/content.js, e.g.  focus: "center top"  or  focus: "center 30%".
- Keep each file under about 500 KB (resize to ~1600 px on the long side) so
  the page loads fast on phones. squoosh.app is a free way to do this.
- A missing file is not an error: the illustration shows until you add it.
