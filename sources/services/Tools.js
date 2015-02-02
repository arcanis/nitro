class Tools {

    search( array, predicate ) {

        for ( var t = 0, T = array.length; t < T; ++ t )
            if ( predicate( array[ t ], t, array ) )
                return array[ t ];

        return null;

    }

    searchIndex( array, predicate ) {

        for ( var t = 0, T = array.length; t < T; ++ t )
            if ( predicate( array[ t ], t, array ) )
                return t;

        return -1;

    }

    uuidv4( ) {

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, c => {

            var r = Math.random( ) * 16 | 0;
            var v = c == 'x' ? r : ( r & 0x3 | 0x8 );

            return v.toString( 16 );

        } );

    }

    hash( string ) {

        if ( string.length === 0)
            return 0;

        var hash = 0;
        var chr, len;

        for ( var t = 0, T = string.length; t < T; ++ t ) {
            chr = string.charCodeAt( t );
            hash = ( ( hash << 5 ) - hash ) + chr;
            hash |= 0; // Convert to 32bit integer
        }

        return hash;

    }

    rng( seed = 0 ) {

        if ( typeof seed === 'string' )
            seed = this.hash( seed );

        if ( seed % Math.PI === 0 )
            seed += 1;

        var rng = function ( ) {

            var x = Math.sin( seed ++ ) * 10000;
            return x - Math.floor( x );

        };

        rng.fromRange = function ( min, max ) {

            return min + Math.floor( this( ) * ( max - min ) );

        };

        rng.fromArray = function ( array ) {

            return array[ this.fromRange( 0, array.length ) ];

        };

        return rng;

    }

}

export class ToolsProvider {

    constructor( ) {

        this.$get = [ ( ) => {
            return new Tools( { }, {
            } );
        } ];

    }

}
