class Application {

    constructor( ) {

        this.rootElement = null;

    }

    setRootElement( element ) {

        if ( this.rootElement )
            throw new Error( 'Tried to set more than a single root element' );

        if ( ! element && this.rootElement )
            throw new Error( 'The root element cannot be unset once set' );

        this.rootElement = element;

    }

}

export class ApplicationProvider {

    constructor( ) {
        this.$get = [ ( ) => {
            return new Application( { }, {
            } );
        } ];
    }

}
