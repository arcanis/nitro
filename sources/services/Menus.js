class Menus {

    constructor( ) {

        this._menus = [ ];

    }

    registerMenu( menu ) {

        this._menus.push( menu );

    }

    unregisterMenu( menu ) {

        this._menus.splice( this._menus.indexOf( menu ), 1 );

    }

    select( name ) {

        for ( var menu of this._menus )
            if ( menu.name === name )
                break ;

        if ( menu ) {
            menu.select( );
        }

    }

    clear( ) {

        for ( var menu of this._menus ) {
            menu.unselect( );
        }

    }

}

export class MenusProvider {

    constructor( ) {

        this.$get = [ ( ) => {
            return new Menus( { }, {
            } );
        } ];

    }

}
