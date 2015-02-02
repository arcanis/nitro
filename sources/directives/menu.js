export var menu = [ '$nitroMenus', ( $nitroMenus ) => {

    return {

        transclude : true,
        replace : true,

        template : `
            <div class="nitro-menu" ng-click="$close()">
                <div class="nitro-menu-target">
                    <div class="nitro-menu-panel" ng-click="$event.stopPropagation()" ng-transclude>
                    </div>
                </div>
            </div>
            `,

        require : [ 'nitroMenu' ],

        controller : class {

            constructor( $element, $attrs ) {

                this.$element = $element;

                this.name = $attrs.name;

            }

            select( ) {

                this.$element.attr( 'active', 'active' );

            }

            unselect( ) {

                this.$element.removeAttr( 'active' );

            }

        },

        link( $scope, $element, $attrs, [ nitroMenu ] ) {

            $nitroMenus.registerMenu( nitroMenu );

            $scope.$close = function ( ) {
                nitroMenu.unselect( );
            };

            $scope.$on( '$nitroItemActionTriggerSuccess', ( ) => {
                $scope.$close( );
            } );

            $scope.$on( '$destroy', ( ) => {
                $nitroMenus.unregisterMenu( nitroMenu );
            } );

        }

    };

} ];
