export var nitroPermissionSetup = [ '$nitroNavigation', '$nitroPermission', '$rootScope', ( $nitroNavigation, $nitroPermission, $rootScope ) => {

    $rootScope.$on( '$nitroStateChangeStart', ( e, { state, holdDown } ) => {

        if ( ! state.permissions )
            return ;

        var next = holdDown( );

        $nitroPermission.checkPermissions( state.permissions ).then( redirection => {

            if ( redirection ) {
                $nitroNavigation.goTo( redirection, { replace : true } );
            } else {
                next( );
            }

        } );

    } );

} ];
