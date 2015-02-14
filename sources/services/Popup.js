class Popup {

    constructor( { $animate, $compile, $nitroHistoryBack, $nitroTools, $rootElement, $templateRequest }, { } ) {

        this.$animate = $animate;
        this.$compile = $compile;
        this.$nitroHistoryBack = $nitroHistoryBack;
        this.$nitroTools = $nitroTools;
        this.$rootElement = $rootElement;

    }

    open( options ) {

        return this.$nitroTools.template( options ).then( template => {

            return this._createElement( angular.extend( { }, options, { template } ) );

        } ).then( element => {

            return this._openElement( element );

        } );

    }

    _createElement( { className, template, $scope, scope = $scope } ) {

        var element = angular.element( '<nitro-popup/>' );
        element.html( template || '' );

        if ( className )
            element.addClass( className );

        var subscope = scope.$new( );
        subscope.$close = ( ) => { this._closeElement( element ) };

        this.$rootElement.append( element );
        this.$compile( element )( subscope );
        element.detach( );

        subscope.$on( '$destroy', ( ) => {
            element.remove( );
        } );

        return element;

    }

    _openElement( element ) {

        if ( ! element )
            return ;

        this._defuseBackAction = this.$nitroHistoryBack.registerBackAction( ( ) => {
            this._closeElement( element );
        } );

        this._currentElement = element;

        return this.$animate.enter( element, this.$rootElement );

    }

    _closeElement( element ) {

        if ( ! element || this._currentElement !== element )
            return ;

        if ( this._defuseBackAction )
            this._defuseBackAction( );

        this._currentElement = null;

        this.$animate.leave( element );

    }

}

export class PopupProvider {

    constructor( ) {
        this.$get = [ '$animate', '$compile', '$nitroHistoryBack', '$nitroTools', '$rootElement', ( $animate, $compile, $nitroHistoryBack, $nitroTools, $rootElement ) => {
            return new Popup( { $animate, $compile, $nitroHistoryBack, $nitroTools, $rootElement }, {
            } );
        } ];
    }

}
