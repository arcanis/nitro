import { content }              from './directives/content';
import { header }               from './directives/header';
import { item }                 from './directives/item';
import { lipsum }               from './directives/lipsum';
import { loading }              from './directives/loading';
import { menu }                 from './directives/menu';
import { page }                 from './directives/page';
import { popover }              from './directives/popover';
import { sref }                 from './directives/sref';
import { tabs }                 from './directives/tabs';
import { tab }                  from './directives/tab';
import { theme }                from './directives/theme';
import { tools }                from './directives/tools';
import { tool }                 from './directives/tool';
import { transclude }           from './directives/transclude';
import { view }                 from './directives/view';

import { HistoryBackProvider }  from './services/HistoryBack';
import { LoadingProvider }      from './services/Loading';
import { LocationProvider }     from './services/Location';
import { MenusProvider }        from './services/Menus';
import { NavigationProvider }   from './services/Navigation';
import { PermissionProvider }   from './services/Permission';
import { PopoverProvider }      from './services/Popover';
import { ToolsProvider }        from './services/Tools';

import { nitroPermissionSetup } from './setups/nitroPermission';
import { nitroNavigationSetup } from './setups/nitroNavigation';

window.angular.module( 'nitro', [ ] )

    .directive( 'nitroContent'     , content )
    .directive( 'nitroHeader'      , header )
    .directive( 'nitroItem'        , item )
    .directive( 'nitroLipsum'      , lipsum )
    .directive( 'nitroLoading'     , loading )
    .directive( 'nitroMenu'        , menu )
    .directive( 'nitroPage'        , page )
    .directive( 'nitroPopover'     , popover )
    .directive( 'nitroSref'        , sref )
    .directive( 'nitroTabs'        , tabs )
    .directive( 'nitroTab'         , tab )
    .directive( 'nitroTheme'       , theme )
    .directive( 'nitroTools'       , tools )
    .directive( 'nitroTool'        , tool )
    .directive( 'nitroTransclude'  , transclude )
    .directive( 'nitroView'        , view )

    .provider( '$nitroHistoryBack' , HistoryBackProvider )
    .provider( '$nitroLoading'     , LoadingProvider )
    .provider( '$nitroLocation'    , LocationProvider )
    .provider( '$nitroMenus'       , MenusProvider )
    .provider( '$nitroNavigation'  , NavigationProvider )
    .provider( '$nitroPermission'  , PermissionProvider )
    .provider( '$nitroPopover'     , PopoverProvider )
    .provider( '$nitroTools'       , ToolsProvider )

    .run( nitroPermissionSetup )
    .run( nitroNavigationSetup )

;
