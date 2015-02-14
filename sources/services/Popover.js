class Popover {

    constructor( { $animate, $compile, $nitroHistoryBack, $nitroTools, $rootElement }, { } ) {

        this.$animate = $animate;
        this.$compile = $compile;
        this.$nitroHistoryBack = $nitroHistoryBack;
        this.$nitroTools = $nitroTools;
        this.$rootElement = $rootElement;

    }

    create( options ) {

        var elementPromise = this.$nitroTools.template( options ).then( template => {
            return this._createElement( angular.extend( { }, options, { template } ) );
        } );

        return {

            open : ( target ) => {

                elementPromise.then( element => {
                    this._openElement( element, target );
                } );

            },

            close : ( ) => {

                elementPromise.then( element => {
                    this._closeElement( element );
                } );

            }

        };

    }

    _createElement( { template, $scope, scope = $scope } ) {

        var element = angular.element( '<nitro-popover/>' );
        element.html( template || '' );

        var subscope = scope.$new( );
        subscope.$close = ( ) => { this._closeElement( element ) };

        this.$rootElement.append( element );
        this.$compile( element )( subscope );

        subscope.$on( '$destroy', ( ) => {
            element.remove( );
        } );

        return element;

    }

    _openElement( element, target ) {

        if ( ! element || ! target )
            return ;

        if ( target.currentTarget )
            target = target.currentTarget;

        this._defuseBackAction = this.$nitroHistoryBack.registerBackAction( ( ) => {
            this._close( element );
        } );

        var boundingRect = angular.element( target )[ 0 ].getBoundingClientRect( );

        element.css( 'left', `${boundingRect.left}px` );
        element.css( 'top', `${boundingRect.top}px` );
        element.css( 'width', `${boundingRect.width}px` );
        element.css( 'height', `${boundingRect.height}px` );

        this._currentElement = element;
        this.$animate.addClass( element, 'nitro-active' );

    }

    _closeElement( element ) {

        if ( ! element || this._currentElement !== element )
            return ;

        if ( this._defuseBackAction )
            this._defuseBackAction( );

        if ( this._currentElement ) {
            this.$animate.removeClass( this._currentElement, 'nitro-active' );
            this._currentElement = null;
        }

    }

}

export class PopoverProvider {

    constructor( ) {
        this.$get = [ '$animate', '$compile', '$nitroHistoryBack', '$nitroTools', '$rootElement', ( $animate, $compile, $nitroHistoryBack, $nitroTools, $rootElement ) => {
            return new Popover( { $animate, $compile, $nitroHistoryBack, $nitroTools, $rootElement }, {
            } );
        } ];
    }

}
