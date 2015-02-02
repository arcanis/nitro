export var item = [ '$nitroNavigation', ( $nitroNavigation ) => {

    return {

        replace : true,

        scope : {
            'action' : '&',
            'sref' : '@',
            'title' : '@'
        },

        template : `
            <div class="nitro-item" ng-click="trigger($event)">
                <div class="nitro-item-title" ng-bind="title">
                </div>
            </div>
        `,

        link( $scope, $element, $attrs ) {

            $scope.trigger = function ( $event ) {

                if ( $scope.sref ) {

                    var options = { replace : false };

                    if ( $attrs.srefAction === 'replace' )
                        options.replace = true;

                    $nitroNavigation.goTo( $scope.sref, options );
                    $scope.$emit( '$nitroItemActionTriggerSuccess' );

                } else if ( $attrs.action /* $scope.action is always truthy */ ) {

                    $scope.action( { $event } );
                    $scope.$emit( '$nitroItemActionTriggerSuccess' );

                }

            };

        }

    };

} ];
