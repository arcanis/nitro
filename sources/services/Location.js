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

    path( path, { state = { }, replace = false } = { } ) {

        if ( typeof path === 'undefined' )
            return this.$window.location.hash.substr( 1 );

        if ( ! path )
            path = this.path( );

        if ( path[ 0 ] !== '/' )
            path = '/' + path;

        this._currentStateId = state.$nitroLocationStateId = ! replace
            ? this._currentStateId + 1
            : this._currentStateId;

        var action = replace ? 'replaceState' : 'pushState';
        this.$window.history[ action ]( state, null, '#' + path );

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
