class Loading {

    constructor( { $compile, $nitroApplication, $rootScope } ) {

        this.$compile = $compile;
        this.$nitroApplication = $nitroApplication;
        this.$rootScope = $rootScope;

        this._element = angular.element( '<nitro-loading/>' );
        this._scope = this.$rootScope.$new( );

        this._scope.messages = [ ];

        this.$nitroApplication.rootElement.append( this._element );
        this.$compile( this._element )( this._scope );

    }

    open( text ) {

        var wrapper = { text };

        this._scope.messages.unshift( wrapper );

        return ( ) => {
            this._scope.messages.splice( this._scope.messages.indexOf( wrapper ), 1 );
        };

    }

}

export class LoadingProvider {

    constructor( ) {
        this.$get = [ '$compile', '$nitroApplication', '$rootScope', ( $compile, $nitroApplication, $rootScope ) => {
            return new Loading( { $compile, $nitroApplication, $rootScope }, {
            } );
        } ];
    }

}
