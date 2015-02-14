export var popup = [ ( ) => {

    return {

        transclude : true,
        replace : true,

        template : `
            <div class="nitro-popup-wrapper">
                <div class="nitro-popup-overlay" ng-click="$close()">
                </div>
                <div class="nitro-popup" nitro-transclude scope-policy="preserve">
                </div>
            </div>
        `

    };

} ];
