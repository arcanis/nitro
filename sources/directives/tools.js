export var tools = [ ( ) => {

    return {

        transclude : true,
        replace : true,

        template : `
            <div class="nitro-tools" nitro-transclude scope-policy="preserve">
            </div>
        `

    };

} ];
