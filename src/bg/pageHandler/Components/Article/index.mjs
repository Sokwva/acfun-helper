import { importVue } from "../../../../common/modulesLib/SFCUtil.mjs";
import { mangaMode } from "./MangaMode.mjs";

const sfcData = await importVue("pageHandler/Components/Article/index.vue");

/**@type {import("../../../../../declares/Vue/VueRuntimeCore").Component} */
const app = {
    components: {
        mangaMode
    },
    template:sfcData.template,
    data() {
        return {

        }
    },
    methods: {

    },
    mounted: function () {
        mdui.mutation("div#mangaMode");
    }
}
export const articleApp = app