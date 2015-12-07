class Location {

    constructor( { $rootScope, $window }, { } ) {

        this.$rootScope = $rootScope;
        this.$window = $window;

        this._currentStateId = ( $window.history.state && $window.history.state.$nitroLocationStateId ) || 0;

        this.$window.addEventListener( 'popstate', e => {

            var previousStateId = this._currentStateId;
            var newStateId = this._currentStateId = e.state ? e.state.$nitroLocationStateId : 0;

            $rootScope.$broadcast( '$nitroLocationChangeSuccess', {
                forward : newStateId > previousStateId,
                state : e.state || { }
            } );

        } );

        if ( ! this.path( ) ) {
            this.path( '/', { replace : true } );
        }

    }

    path( newPath, { state = { }, replace = false } = { } ) {

        if ( typeof newPath === 'undefined' )
            return this.$window.location.hash.substr( 1 );

        if ( ! newPath )
            newPath = this.path( );

        if ( newPath[ 0 ] !== '/' )
            newPath = '/' + newPath;

        this._currentStateId = state.$nitroLocationStateId = ! replace
            ? this._currentStateId + 1
            : this._currentStateId;

        var action = replace ? 'replaceState' : 'pushState';
        this.$window.history[ action ]( state, null, '#' + newPath );

        this.$rootScope.$broadcast( '$nitroLocationChangeSuccess', {
            forward : true,
            state : state
        } );

        return this;

    }

}

export class LocationProvider {

    constructor( ) {

        this.$get = [ '$rootScope', '$window', ( $rootScope, $window ) => {
            return new Location( { $rootScope, $window }, {
            } );
        } ];

    }

}
