export var tool = [ ( ) => {

    return {

        replace : true,

        scope : {
            'icon' : '@',
            'action' : '&'
        },

        template : `
            <div class="nitro-tool" ng-click="action({ $event : $event })">
                <i class="icon" ng-class="icon"></i>
            </div>
            `,

        link( $scope ) {

        }

    };

} ];
