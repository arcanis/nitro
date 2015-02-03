export var theme = [ '$window', ( $window ) => {

    return {

        link( $scope, $element, $attrs ) {

            var currentTheme = null;

            $attrs.$observe( 'nitroTheme', ( ) => {

                var theme = $attrs.nitroTheme;

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
