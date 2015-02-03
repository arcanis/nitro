class Navigation {

    constructor( { $nitroLocation, $nitroTools, $rootScope, $templateRequest }, { router } ) {

        this.$nitroLocation = $nitroLocation;
        this.$nitroTools = $nitroTools;
        this.$rootScope = $rootScope;
        this.$templateRequest = $templateRequest;

        this._router = router;
        this._version = { };

        this.currentState = null;

        this.$rootScope.$on( '$nitroLocationChangeSuccess', ( e, { forward, state } ) => {
            this._triggerStateChange( this._resolveUrl( $nitroLocation.path( ) ), {
                type : forward ? 'forward' : 'backward'
            } );
        } );

    }

    goTo( path, { replace = false } = { } ) {

        var state = this._resolveUrl( path );

        if ( ! state )
            throw new Error( 'Invalid path ' + path );

        this.$nitroLocation.path( path, { replace } );

    }

    _loadTemplate( url ) {

        return this.$templateRequest( url );

    }

    _loadObjectTemplate( object ) {

        if ( typeof object.template === 'string' )
            return Promise.resolve( );

        if ( ! object.template && ! object.templateUrl )
            return Promise.resolve( );

        if ( object._templateLoader )
            return object._templateLoader;

        var templatePromise = ! object.template
            ? this._loadTemplate( object.templateUrl )
            : object.template;

        return object._templateLoader = templatePromise.then( template => {
            object.template = template;
        } );

    }

    _loadStateTemplates( state ) {

        if ( ! state.views )
            return this._loadObjectTemplate( state );

        return Promise.all( Object.keys( state.views ).map( name => {
            return this._loadObjectTemplate( state.views[ name ] );
        } ) );

    }

    _loadAllRequiredTemplates( state ) {

        var templateLoaders = [ ];

        for ( var node = state; node; node = node.parent )
            templateLoaders.push( this._loadStateTemplates( node ) );

        return Promise.all( templateLoaders );

    }

    _triggerStateChange( state, { type } ) {

        if ( ! state )
            return ;

        var version = this._version = { };

        var ready = false;
        var holders = 0;

        var next = ( ) => {

            if ( this._version !== version )
                return ;

            if ( ! ready )
                return ;

            this._loadAllRequiredTemplates( state ).then( ( ) => {
                this.$rootScope.$broadcast( '$nitroStateChangeSuccess', {
                    state : this._currentState = state,
                    type : type
                } );
            } );

        };

        var holdDown = function ( ) {

            var active = true;
            holders += 1;

            return function ( ) {

                if ( ! active )
                    return ;

                active = false;
                holders -= 1;

                if ( holders === 0 ) {
                    next( );
                }

            };

        };

        var event = this.$rootScope.$broadcast( '$nitroStateChangeStart', { state, holdDown } );
        ready = true;

        if ( ! event.defaultPrevented && holders === 0 ) {
            next( );
        }

    }

    _resolveUrl( path ) {

        return this._router( path );

    }

}

export class NavigationProvider {

    constructor( ) {

        this._states = [ ];
        this._otherwise = '/';

        this.$get = [ '$nitroLocation', '$nitroTools', '$rootScope', '$templateRequest', ( $nitroLocation, $nitroTools, $rootScope, $templateRequest ) => {
            return new Navigation( { $nitroLocation, $nitroTools, $rootScope, $templateRequest }, {
                router : this._getRouter( )
            } );
        } ];

    }

    state( name, options ) {

        this._states.push( angular.extend( { name }, options ) );

        return this;

    }

    otherwise( path ) {

        this._otherwise = path;

        return this;

    }

    _finalizeStates( ) {

        var stateByName = { };

        function _register( state ) {

            stateByName[ state.name ] = state;

        }

        function _setupStateHierarchy( state ) {

            var name = state.name;
            var pivot = name.lastIndexOf( '.' );
            var parentName = name.substr( 0, pivot );

            stateByName[ name ] = state;

            if ( ! parentName )
                return ;

            if ( ! stateByName[ parentName ] )
                throw new Error( `The parent state of ${name} has not been defined` );

            state.parent = stateByName[ parentName ];

            if ( stateByName[ parentName ].pattern ) {
                state.pattern = stateByName[ parentName ].pattern + state.pattern;
            }

        }

        function _buildRegexp( state ) {

            var regexpString = state.pattern;
            state.keys = [ ];

            if ( ! regexpString )
                return ;

            regexpString = regexpString.replace( /:(\w+)(\(?)/g, ( _, name, regexp ) => {
                state.keys.push( name );
                return regexp ? '(' : '([\\w-]+)';
            } );

            state.regexp = new RegExp( '^' + regexpString + '$' );

        }

        function _excludeAbstractStates( state ) {

            return ! state.abstract;

        }

        var states = this._states.slice( );

        states.forEach( _register );
        states.forEach( _setupStateHierarchy );
        states.forEach( _buildRegexp );

        return states.filter( _excludeAbstractStates );

    }

    _getRouter( ) {

        var states = this._finalizeStates( );
        var otherwise = this._otherwise;

        return function router( path, { otherwiseRedirect = true } = { } ) {

            var match;

            for ( var t = 0, T = states.length; t < T; ++ t )
                if ( ( match = path.match( states[ t ].regexp ) ) )
                    break ;

            if ( ! match && otherwise && otherwiseRedirect )
                return router( otherwise, { otherwiseRedirect : false } );

            if ( ! match )
                return null;

            var state = Object.create( states[ t ] );

            state.path = path;
            state.parameters = { };

            for ( var t = 0, T = state.keys.length; t < T; ++ t )
                state.parameters[ state.keys[ t ] ] = match[ 1 + t ];

            return state;

        };

    }

};
