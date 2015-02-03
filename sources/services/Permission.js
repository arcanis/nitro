class Permission {

    constructor( { $q }, { roles } ) {

        this.$q = $q;

        this._roles = roles;

    }

    checkPermissions( permissions ) {

        if ( Array.isArray( permissions ) ) {
            permissions = permissions.slice( );
        } else {
            permissions = [ permissions ];
        }

        var _next = ( ) => {

            if ( permissions.length === 0 )
                return null;

            var permissionSet = permissions.shift( );

            if ( ! permissionSet.redirectTo )
                return Promise.reject( new Error( 'A permission set is missing a redirect target' ) );

            if ( permissionSet.only && permissionSet.except )
                return Promise.reject( new Error( 'You cannot use both "only" and "except" in a single permission set; both are mutually exclusive' ) );

            if ( ! permissionSet.only && ! permissionSet.except )
                return Promise.reject( new Error( 'Each permission set has to contain exactly one "only" or "except" rule' ) );

            var redirectTo = permissionSet.redirectTo;
            var roles = permissionSet.only || permissionSet.except;
            var expected = permissionSet.only ? true : false;

            return this.checkRoles( roles, expected ).then( validated => {
                return validated ? _next( ) : redirectTo;
            } );

        };

        return _next( ).then( value => {
            return this.$q.when( value );
        } );

    }

    checkRoles( roles, expected ) {

        return this._every( roles.map( role => Promise.resolve( this._roles[ role ]( ) ) ), value => value === expected );

    }

    _every( promises, callback ) {

        return this.$q( ( resolve, reject ) => {

            var remainingCount = promises.length;

            var processOne = value => {
                Promise.resolve( callback( value ) ).then( value => {

                    if ( ! value ) {
                        resolve( false );
                    } else if ( -- remainingCount === 0 ) {
                        resolve( true );
                    }

                } );
            };

            for ( var promise of promises ){
                promise.then( processOne ).catch( reject );
            }

        } );

    }

}

export class PermissionProvider {

    constructor( ) {

        this._roles = { };

        this.$get = [ '$q', ( $q ) => {
            return new Permission( { $q }, {
                roles : angular.copy( this._roles )
            } );
        } ];

    }

    role( name, callback ) {

        this._roles[ name ] = callback;

        return this;

    }

}
