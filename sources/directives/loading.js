export var loading = [ ( ) => {

    return {

        replace : true,

        template : `
            <div ng-if="messages.length > 0" class="nitro-loading">
                <div class="nitro-loading-content">
                    {{ messages[ 0 ].text }}
                    <span class="nitro-loading-ellipsis nitro-loading-ellipsis-0">.</span><!--
                    --><span class="nitro-loading-ellipsis nitro-loading-ellipsis-1">.</span><!--
                    --><span class="nitro-loading-ellipsis nitro-loading-ellipsis-2">.</span>
                </div>
            </div>
        `

    };

} ];
