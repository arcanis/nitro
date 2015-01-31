export var header = [ ( ) => {

    return {

        transclude : true,
        replace : true,

        scope : {
            title : '@'
        },

        template : `
            <div class="nitro-header">
                <div class="nitro-header-title" ng-bind="title">
                </div>
                <nitro-transclude scope-policy="parent">
                </nitro-transclude>
            </div>
        `

    };

} ];
