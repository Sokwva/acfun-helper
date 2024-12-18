
import { ModuleStd } from "@/Declare/FeatureModule"
import { module as searchMenu } from "@/Modules/Global/SearchMenu/searchMenu"
import { module as omniAcid } from "./Global/Omnibox/acid"
import { module as timelineMenu } from "./Global/TimelineMenu/timelineMenu"
import { module as unreadMsg } from "./Global/Messages/unread"

export const bgFeatures: Record<string, ModuleStd.manifest> = {
    searchMenu, omniAcid, timelineMenu, unreadMsg
}