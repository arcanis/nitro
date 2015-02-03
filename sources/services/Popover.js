class Popover {

    constructor( { $animate, $compile, $nitroHistoryBack, $rootElement, $templateRequest }, { } ) {

        this.$animate = $animate;
        this.$compile = $compile;
        this.$nitroHistoryBack = $nitroHistoryBack;
        this.$rootElement = $rootElement;
        this.$templateRequest = $templateRequest;

    }

    fromTemplateUrl( templateUrl, options ) {

        var elementPromise = this.$templateRequest( templateUrl ).then( template => {
            return this.create( angular.extend( { template }, options ) );
        } );

        return {

            open : ( target ) => {

                elementPromise.then( element => {
                    this.open( element, target );
                } );

            },

            close : ( ) => {

                elementPromise.then( element => {
                    this.close( element );
                } );

            }

        };

    }

    create( { template, $scope } ) {

        var element = angular.element( '<nitro-popover/>' );
        element.html( template || '' );

        this.$rootElement.append( element );
        this.$compile( element )( $scope );

        $scope.$on( '$destroy', ( ) => {
            element.remove( );
        } );

        return element;

    }

    open( element, target ) {

        if ( ! element || ! target )
            return ;

        if ( target.currentTarget )
            target = target.currentTarget;

        this._defuseBackAction = this.$nitroHistoryBack.registerBackAction( ( ) => {
            this.close( );
        } );

        var boundingRect = angular.element( target )[ 0 ].getBoundingClientRect( );

        element.css( 'left', `${boundingRect.left}px` );
        element.css( 'top', `${boundingRect.top}px` );
        element.css( 'width', `${boundingRect.width}px` );
        element.css( 'height', `${boundingRect.height}px` );

        this._currentElement = element;
        this.$animate.addClass( element, 'nitro-active' );

    }

    close( element ) {

        if ( element && this._currentElement !== element )
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
        this.$get = [ '$animate', '$compile', '$nitroHistoryBack', '$rootElement', '$templateRequest', ( $animate, $compile, $nitroHistoryBack, $rootElement, $templateRequest ) => {
            return new Popover( { $animate, $compile, $nitroHistoryBack, $rootElement, $templateRequest }, {
            } );
        } ];
    }

}
