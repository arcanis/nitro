export var tabs = [ '$nitroTools', ( $nitroTools ) => {

    return {

        transclude : true,
        replace : true,

        template : `
            <div class="nitro-tabs">
                <div class="nitro-tabs-def" ng-transclude>
                </div>
                <div class="nitro-tabs-bar">
                    <div ng-repeat="tab in tabs" class="nitro-tab" nitro-sref="{{ tab.sref }}" nitro-sref-action="replace">
                        <div class="nitro-tab-label" ng-bind="tab.title"></div>
                        <div ng-if="$index == 0 && selected >= 0" class="nitro-tab-pointer" ng-style="{ transform : 'translateX(' + (selected * 100) + '%)' }"></div>
                    </div>
                </div>
                <nitro-view>
                </nitro-view>
            </div>
        `,

        controller : class {

            constructor( $scope, $element ) {

                this.$scope = $scope;

                this.$scope.selected = -1;
                this.$scope.tabs = [ ];

                this.$scope.$on( '$nitroViewChangeTransitionStart', ( e, after, before, options ) => {

                    if ( before && after && before.tab && after.tab ) {
                        options.direction = this.getDirection( before.tab, after.tab );
                    } else {
                        options.direction = 'direct';
                    }

                    var tab = after && this.findTabByName( after.tab );
                    var index = tab ? this.$scope.tabs.indexOf( tab ) : -1;

                    this.$scope.selected = index;

                } );

            }

            getDirection( from, to ) {

                if ( from === to )
                    return 'direct';

                var fromIndex = this.$scope.tabs.indexOf( this.findTabByName( from ) );
                var toIndex = this.$scope.tabs.indexOf( this.findTabByName( to ) );

                if ( fromIndex === -1 || toIndex === -1 )
                    return 'direct';

                return fromIndex > toIndex ? 'left' : 'right';

            }

            findTabByName( name ) {

                return $nitroTools.search( this.$scope.tabs, tab => tab.name === name );

            }

            addTab( tab = { } ) {

                this.$scope.tabs.push( tab );

                return tab;

            }

            removeTab( tab ) {

                this.$scope.tabs.splice( this.$scope.tabs.indexOf( tab ), 1 );

            }

        }

    };

} ];
