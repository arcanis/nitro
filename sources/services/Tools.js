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

}

export class ToolsProvider {

    constructor( ) {

        this.$get = [ ( ) => {
            return new Tools( { }, {
            } );
        } ];

    }

}
