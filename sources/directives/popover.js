export var popover = [ '$nitroPopover', ( $nitroPopover ) => {

    return {

        transclude : true,
        replace : true,

        scope : true,

        template : `
            <div class="nitro-popover-target">
                <div class="nitro-popover-overlay" ng-click="$close()">
                </div>
                <div class="nitro-popover">
                    <div class="nitro-popover-content" nitro-transclude scope-policy="preserve">
                    </div>
                </div>
            </div>
        `,

        link( $scope ) {

            $scope.$close = function ( ) {
                $nitroPopover.close( );
            };

        }

    };

} ];
