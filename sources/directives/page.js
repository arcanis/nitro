export var page = [ ( ) => {

    return {

        transclude : true,
        replace : true,

        template : `
            <div class="nitro-page" nitro-transclude scope-policy="preserve">
            </div>
        `

    };

} ];
