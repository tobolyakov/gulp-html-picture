# gulp-html-picture

This is a modified version of the plugin [gulp-webp-html](https://www.npmjs.com/package/gulp-webp-html).
An option object has been added to the plugin.

Allows you to define for whom to make the Picture construct.

Added a check to ensure that there are no random triggers if your html already contains Picture constructs.

Added checks if you use the <img> tag with **webp** and **avif** formats, then the Picture construct is not created for them

## Option plugin

List of all available parameters:

| Name      | Type    | Default      | Description                                                  |
| --------- | ------- | ------------ | ------------------------------------------------------------ |
| webp      | boolean | true         | Creates a Picture construct with a <source> tag in which the **WEBP** image type is inserted |
| avif      | boolean | false        | Creates a Picture construct with a <source> tag in which the **AVIF** image type is inserted |
| noPicture | string  | 'no_picture' | The identifier by which it is determined for which <img> tags it is not necessary to make the Picture construction |



## Example

```html
// Input
<img src="/images/gallery.jpg">

// Output
<picture>
    <source srcset="/images/gallery.webp" type="image/webp">
    <img src="/images/gallery.jpg">
</picture>

// Input
<img src="/images/gallery.jpg">

// Output
<picture>
    <source srcset="/images/gallery.webp" type="image/webp">
    <source srcset="/images/gallery.avif" type="image/avif">
    <img src="/images/gallery.jpg">
</picture>

// Input
<img src="/images/gallery.svg">

// Output
<img src="/images/gallery.svg">

// Input
<img src="/images/gallery.gif">

// Output
<img src="/images/gallery.gif">

// Input
<img src="/images/gallery.webp">

// Output
<img src="/images/gallery.webp">

// Input
<img src="/images/gallery.avif">

// Output
<img src="/images/gallery.avif">

// Input
<picture>
    <source srcset="/images/gallery.webp" type="image/webp">
    <source srcset="/images/gallery.avif" type="image/avif">
    <img src="/images/gallery.jpg">
</picture>

// Output
<picture>
    <source srcset="/images/gallery.webp" type="image/webp">
     <source srcset="/images/gallery.avif" type="image/avif">
    <img src="/images/gallery.jpg">
</picture>

```


## Install
```bash
npm i --save-dev git+ssh://git@github.com/tobolyakov/gulp-html-picture.git
```
## Usage
```javascript
const gulpHtmlPicture = require( 'gulp-html-picture' );

task( 'html:picture', () => {
	return src( '.src/*.html', {
		since: lastRun( 'html:picture' )
	} )
		.pipe( gulpHtmlPicture({webp: true, avif: true, noPicture: 'no_picture'}) )
		.pipe( dest( './dist/' ) )
} );
```

### Caniuse

[WebP image format]: https://caniuse.com/webp
[AVIF image format]: https://caniuse.com/avif

