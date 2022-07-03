const Vinyl = require( 'vinyl' )
const PluginError = Vinyl.PluginError
const through = require( 'through2' )
const path = require( 'path' )
const pluginName = 'gulp-html-picture'

module.exports = ( options = { webp: true, avif: false, noPicture: 'no_picture' } ) => {
	/**
	 * extensions
	 *
	 * [ '.jpg', '.png', '.jpeg', '.GIF', '.gif', '.JPG', '.PNG', '.JPEG' ]
	 *
	 * */
	const SVG = '.svg';
	const GIF = '.gif';
	const WEBP = '.webp';
	const AVIF = '.avif';

	return through.obj( function ( file, enc, cb ) {
		if ( file.isNull() ) {
			cb( null, file )
			return
		}
		if ( file.isStream() ) {
			cb( new PluginError( pluginName, 'Streaming not supported' ) )
			return
		}
		try {
			let inPicture = false
			const data = file.contents
				.toString()
				.split( '\n' )
				.map( ( content ) => {
					if ( content.indexOf( '<picture' ) + 1 ) inPicture = true
					if ( content.indexOf( '</picture' ) + 1 ) inPicture = true
					if ( content.indexOf( '<img' ) + 1 && !inPicture ) {

						const Re = /<img([^>]*)src=\"(\S+)\"([^>]*)>/gi;
						let imageItem,
							imagesArr = [],
							imagesTagArr = [],
							imagesUrlArr = [],
							newHTMLArr = [];

						while ( imageItem = Re.exec( content ) ) {
							imagesArr.push( imageItem )
						}

						imagesArr.forEach( item => {
							if ( item[ 2 ].includes( SVG ) || item[ 2 ].includes( GIF ) || item[ 2 ].includes( WEBP ) || item[ 2 ].includes( AVIF ) || item[ 3 ].includes( options.noPicture ) ) {
								return
							} else {
								imagesUrlArr.push( item[ 2 ] )
								imagesTagArr.push( item[ 0 ] )
							}
						} )

						imagesUrlArr.forEach( ( item, id ) => {
							if ( item.includes( SVG ) || item.includes( GIF ) || item[ 2 ].includes( WEBP ) || item[ 2 ].includes( AVIF ) || item[ 3 ].includes( options.noPicture ) ) {
								newHTMLArr.push( item[ id ] )
								return
							} else {
								let extension = path.extname( imagesUrlArr[ id ] );
								imagesUrlArr[ id ] = imagesUrlArr[ id ].replace( extension, '' )

								newHTMLArr.push( pictureRender( imagesUrlArr[ id ], imagesTagArr[ id ] ) )
							}
							content = content.replace( imagesTagArr[ id ], newHTMLArr[ id ] )
						} )
						return content;
					}
					return content;
				} )
				.join( '\n' )

			function pictureRender( url, imgTag ) {
				return (
					`<picture>${ options.webp && `<source srcset="${ url }.webp" type="image/webp">` }${ options.avif && `<source srcset="${ url }.avif" type="image/avif">` }${ imgTag }</picture>`
				)
			}

			file.contents = new Buffer.from( data )
			this.push( file )
		} catch ( err ) {
			console.log( '[ERROR] Make sure that there are no spaces and/or Cyrillic in the name of the image file' )
			this.emit( 'error', new PluginError( pluginName, err ) )
		}
		cb()
	} )
}
