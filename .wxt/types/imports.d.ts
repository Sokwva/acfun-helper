// Generated by wxt
export {}
declare global {
  const ContentScriptContext: typeof import('wxt/utils/content-script-context')['ContentScriptContext']
  const InvalidMatchPattern: typeof import('wxt/utils/match-patterns')['InvalidMatchPattern']
  const MatchPattern: typeof import('wxt/utils/match-patterns')['MatchPattern']
  const browser: typeof import('wxt/browser')['browser']
  const createIframeUi: typeof import('wxt/utils/content-script-ui/iframe')['createIframeUi']
  const createIntegratedUi: typeof import('wxt/utils/content-script-ui/integrated')['createIntegratedUi']
  const createShadowRootUi: typeof import('wxt/utils/content-script-ui/shadow-root')['createShadowRootUi']
  const defineAppConfig: typeof import('wxt/utils/define-app-config')['defineAppConfig']
  const defineBackground: typeof import('wxt/utils/define-background')['defineBackground']
  const defineContentScript: typeof import('wxt/utils/define-content-script')['defineContentScript']
  const defineUnlistedScript: typeof import('wxt/utils/define-unlisted-script')['defineUnlistedScript']
  const defineWxtPlugin: typeof import('wxt/utils/define-wxt-plugin')['defineWxtPlugin']
  const fakeBrowser: typeof import('wxt/testing')['fakeBrowser']
  const injectScript: typeof import('wxt/utils/inject-script')['injectScript']
  const storage: typeof import('wxt/utils/storage')['storage']
  const useAppConfig: typeof import('wxt/utils/app-config')['useAppConfig']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { Browser } from 'wxt/browser'
  import('wxt/browser')
  // @ts-ignore
  export type { StorageArea, WxtStorage, WxtStorageItem, StorageItemKey, StorageAreaChanges, MigrationError } from 'wxt/utils/storage'
  import('wxt/utils/storage')
  // @ts-ignore
  export type { WxtWindowEventMap } from 'wxt/utils/content-script-context'
  import('wxt/utils/content-script-context')
  // @ts-ignore
  export type { IframeContentScriptUi, IframeContentScriptUiOptions } from 'wxt/utils/content-script-ui/iframe'
  import('wxt/utils/content-script-ui/iframe')
  // @ts-ignore
  export type { IntegratedContentScriptUi, IntegratedContentScriptUiOptions } from 'wxt/utils/content-script-ui/integrated'
  import('wxt/utils/content-script-ui/integrated')
  // @ts-ignore
  export type { ShadowRootContentScriptUi, ShadowRootContentScriptUiOptions } from 'wxt/utils/content-script-ui/shadow-root'
  import('wxt/utils/content-script-ui/shadow-root')
  // @ts-ignore
  export type { ContentScriptUi, ContentScriptUiOptions, ContentScriptOverlayAlignment, ContentScriptAppendMode, ContentScriptInlinePositioningOptions, ContentScriptOverlayPositioningOptions, ContentScriptModalPositioningOptions, ContentScriptPositioningOptions, ContentScriptAnchoredOptions, AutoMountOptions, StopAutoMount, AutoMount } from 'wxt/utils/content-script-ui/types'
  import('wxt/utils/content-script-ui/types')
  // @ts-ignore
  export type { WxtAppConfig } from 'wxt/utils/define-app-config'
  import('wxt/utils/define-app-config')
  // @ts-ignore
  export type { ScriptPublicPath, InjectScriptOptions } from 'wxt/utils/inject-script'
  import('wxt/utils/inject-script')
}
// for vue template auto import
import { UnwrapRef } from 'vue'
declare module 'vue' {
  interface ComponentCustomProperties {
    readonly ContentScriptContext: UnwrapRef<typeof import('wxt/utils/content-script-context')['ContentScriptContext']>
    readonly InvalidMatchPattern: UnwrapRef<typeof import('wxt/utils/match-patterns')['InvalidMatchPattern']>
    readonly MatchPattern: UnwrapRef<typeof import('wxt/utils/match-patterns')['MatchPattern']>
    readonly browser: UnwrapRef<typeof import('wxt/browser')['browser']>
    readonly createIframeUi: UnwrapRef<typeof import('wxt/utils/content-script-ui/iframe')['createIframeUi']>
    readonly createIntegratedUi: UnwrapRef<typeof import('wxt/utils/content-script-ui/integrated')['createIntegratedUi']>
    readonly createShadowRootUi: UnwrapRef<typeof import('wxt/utils/content-script-ui/shadow-root')['createShadowRootUi']>
    readonly defineAppConfig: UnwrapRef<typeof import('wxt/utils/define-app-config')['defineAppConfig']>
    readonly defineBackground: UnwrapRef<typeof import('wxt/utils/define-background')['defineBackground']>
    readonly defineContentScript: UnwrapRef<typeof import('wxt/utils/define-content-script')['defineContentScript']>
    readonly defineUnlistedScript: UnwrapRef<typeof import('wxt/utils/define-unlisted-script')['defineUnlistedScript']>
    readonly defineWxtPlugin: UnwrapRef<typeof import('wxt/utils/define-wxt-plugin')['defineWxtPlugin']>
    readonly fakeBrowser: UnwrapRef<typeof import('wxt/testing')['fakeBrowser']>
    readonly injectScript: UnwrapRef<typeof import('wxt/utils/inject-script')['injectScript']>
    readonly storage: UnwrapRef<typeof import('wxt/utils/storage')['storage']>
    readonly useAppConfig: UnwrapRef<typeof import('wxt/utils/app-config')['useAppConfig']>
  }
}
