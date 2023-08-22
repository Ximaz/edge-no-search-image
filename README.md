# Edge No Search Image

This project aims to counter this button you may see often when using Microsoft Edge :
<br>

![Search Image Button](./assets/search_image_button.png)

To do so, there is a tiny Javascript code you can insert in your HTML to load an image (in Base64 format for now) easily, and without an img attribute. It also deals with rescaling the image if you need to. Example :

```html
<canvas id="mycanvas" data-image-url="https://192.168.1.49/image"></canvas>
<!-- Loads the ENSI library -->
<script src="src/ensi.js"></script>
<script>
//  Create a Canvas Handler instance
//     CSS Selector
    ensi("#mycanvas")
//  Fetch the image.
//                     canvas attribute, async
        .base64FromURL('data-image-url', false)
//  Load the image once fetched.
        .load()
//  Rescale the image and conserve the aspect ratio.
//                        width
        .rescaleWithWidth(1500)
</script>
```