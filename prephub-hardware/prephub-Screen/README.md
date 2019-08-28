This documentation exists for the PREPHUB-Screen, which displays a carousel of images on the Raspberry Pi.
All images are set to span 100% of the height and width.

# Run the program
To run the carousel, run node app.js

Open up your browser to http://localhost:8082/ to see the carousel.

# Add more images

To add more images to the carousel, you don't need to add any code. Simply, drag and drop any image files you want into public/images.

The script load_images.js sends an AJAX request to the host and dynamically loads all images under public/images and populates the bootstrap carousel.

To remove images you don't want, simply just remove them from public/images