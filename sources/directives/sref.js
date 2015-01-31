export var sref = [ '$nitroNavigation', ( $nitroNavigation ) => {

    return {

        link( $scope, $element, $attrs ) {

            $element.on( 'click', ( ) => {

                var options = { replace : false };

                if ( $attrs.nitroSrefAction === 'replace' )
                    options.replace = true;

                $nitroNavigation.goTo( $attrs.nitroSref, options );

            } );

        }

    };

} ];
