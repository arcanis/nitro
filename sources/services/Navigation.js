class Navigation {

    constructor( { $nitroLocation, $nitroTools, $rootScope, $templateRequest }, { router } ) {

        this.$nitroLocation = $nitroLocation;
        this.$nitroTools = $nitroTools;
        this.$rootScope = $rootScope;
        this.$templateRequest = $templateRequest;

        this._router = router;
        this._callbacks = { };

        this.currentRoute = null;

        this.$rootScope.$on( '$nitroLocationChangeSuccess', ( e, { forward, state } ) => {
            this._triggerRouteChange( this._resolveUrl( $nitroLocation.path( ) ), {
                type : forward ? 'forward' : 'backward'
            } );
        } );

        this._triggerRouteChange( this._resolveUrl( $nitroLocation.path( ) ), {
            type : 'direct'
        } );

    }

    goTo( path, { replace = false } = { } ) {

        var route = this._resolveUrl( path );

        if ( ! route )
            throw new Error( 'Invalid path ' + path );

        this.$nitroLocation.path( path, { replace } );

    }

    _loadTemplate( url ) {

        return this.$templateRequest( url );

    }

    _loadObjectTemplate( object ) {

        if ( typeof object.template === 'string' )
            return Promise.resolve( object.templatePromise );

        object.template = typeof object.template === 'undefined'
            ? this._loadTemplate( object.templateUrl )
            : object.template;

        return object.template.then( template => {
            object.template = template;
        } );

    }

    _loadRouteTemplates( route ) {

        if ( ! route.views )
            return this._loadObjectTemplate( route );

        return Promise.all( Object.keys( route.views ).map( name => {
            return this._loadObjectTemplate( route.views[ name ] );
        } ) );

    }

    _loadAllRequiredTemplates( route ) {

        var templateLoaders = [ ];

        for ( var node = route; node; node = node.parent )
            templateLoaders.push( this._loadRouteTemplates( node ) );

        return Promise.all( templateLoaders );

    }

    _triggerRouteChange( route, { type } ) {

        if ( ! route )
            return ;

        this._loadAllRequiredTemplates( route ).then( ( ) => {
            this.$rootScope.$broadcast( '$nitroRouteChangeSuccess', {
                route : this._currentRoute = route,
                type : type
            } );
        } );

    }

    _resolveUrl( path ) {

        return this._router( path );

    }

}

export class NavigationProvider {

    constructor( ) {

        this._routes = [ ];

        this.$get = [ '$nitroLocation', '$nitroTools', '$rootScope', '$templateRequest', ( $nitroLocation, $nitroTools, $rootScope, $templateRequest ) => {
            return new Navigation( { $nitroLocation, $nitroTools, $rootScope, $templateRequest }, {
                router : this._getRouter( )
            } );
        } ];

    }

    route( name, options ) {

        this._routes.push( angular.extend( { name }, options ) );

        return this;

    }

    _finalizeRoutes( ) {

        var routeByName = { };

        function _register( route ) {

            routeByName[ route.name ] = route;

        }

        function _setupRouteHierarchy( route ) {

            var name = route.name;
            var pivot = name.lastIndexOf( '.' );
            var parentName = name.substr( 0, pivot );

            routeByName[ name ] = route;

            if ( ! parentName )
                return ;

            if ( ! routeByName[ parentName ] )
                throw new Error( `The parent route of ${name} has not been defined` );

            route.parent = routeByName[ parentName ];

            if ( routeByName[ parentName ].pattern ) {
                route.pattern = routeByName[ parentName ].pattern + route.pattern;
            }

        }

        function _buildRegexp( route ) {

            var regexpString = route.pattern;
            route.keys = [ ];

            if ( ! regexpString )
                return ;

            regexpString = regexpString.replace( /:(\w+)(\(?)/g, ( _, name, regexp ) => {
                route.keys.push( name );
                return regexp ? '(' : '([\\w-]+)';
            } );

            route.regexp = new RegExp( '^' + regexpString + '$' );

        }

        function _excludeAbstractRoutes( route ) {

            return ! route.abstract;

        }

        var routes = this._routes.slice( );

        routes.forEach( _register );
        routes.forEach( _setupRouteHierarchy );
        routes.forEach( _buildRegexp );

        return routes.filter( _excludeAbstractRoutes );

    }

    _getRouter( ) {

        var routes = this._finalizeRoutes( );
        var otherwise = this._otherwise;

        return function router( path, { otherwiseRedirect = true } = { } ) {

            var match;

            for ( var t = 0, T = routes.length; t < T; ++ t )
                if ( ( match = path.match( routes[ t ].regexp ) ) )
                    break ;

            if ( ! match && otherwise && otherwiseRedirect )
                return router( otherwise, { otherwiseRedirect : false } );

            if ( ! match )
                return null;

            var route = Object.create( routes[ t ] );

            route.path = path;
            route.parameters = { };

            for ( var t = 0, T = route.keys.length; t < T; ++ t )
                route.parameters[ route.keys[ t ] ] = match[ 1 + t ];

            return route;

        };

    }

};
