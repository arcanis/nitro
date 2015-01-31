export var application = [ '$nitroApplication', '$window', ( $nitroApplication, $window ) => {

    return {

        link( $scope, $element, $attrs ) {

            var currentTheme = null;

            $nitroApplication.setRootElement( $element );

            $attrs.$observe( 'theme', ( ) => {

                var theme = $attrs.theme;

                if ( ! theme )
                    theme = 'android';

                if ( theme === currentTheme )
                    return ;

                $element.addClass( 'nitro-disable-transitions' );
                $element.removeClass( 'nitro-theme-' + currentTheme );
                $element.addClass( 'nitro-theme-' + theme );

                currentTheme = theme;

                $window.requestAnimationFrame( ( ) => {
                    $element.removeClass( 'nitro-disable-transitions' );
                } );

            } );

        }

    };

} ];
