import { ref } from 'vue'
import { defineStore } from 'pinia'
import { BlogParam } from '../Entities/E_BlogParam'
import BlogInfoService from '../Services/BlogInfoService'
import UploadService from '../Services/UploadService'



const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme)
}

let BlogParamArray: BlogParam[] = [];
let IsLoading: boolean = false;

export const useAppStore = defineStore('AppStore', {
    state: () => {
        return {
            themeConfig: {
                theme: 'theme-light',
                header_gradient_css: 'var(--header_gradient_css)'
            },
            AllBlogParam: BlogParamArray
        }
    },
    getters: {
        AuthorName(state) {
            return state.AllBlogParam.find(x => x.paramName == 'Blog-AuthorName')?.paramValue;
        },
        AuthorPinYin(state) {
            return state.AllBlogParam.find(x => x.paramName == 'Blog-AuthorPinYin')?.paramValue
        },
        HeadPortrait(state) {
            var ret = ''
            var pictureId = state.AllBlogParam.find(x => x.paramName == 'Blog-HeadPortrait')?.paramValue

            if (pictureId) {
                ret = UploadService.prototype.getImageUri() + pictureId
            }
            return ret;
        },
        BlogParameters() {
            return BlogParamArray
        }
    },
    actions: {
        async GetAllParameter() {
            IsLoading = true;
            this.AllBlogParam = await BlogInfoService.prototype.GetAllBlogParameters();
            IsLoading = false;
        },
        async GetParameterValue(paramName: string) {

            if (this.AllBlogParam.length == undefined || this.AllBlogParam.length == 0) await this.GetAllParameter();
            return this.AllBlogParam.find(x => x.paramName == paramName)?.paramValue;
        },

        toggleTheme(isDark?: boolean) {
            this.themeConfig.theme =
                isDark === true || this.themeConfig.theme === 'theme-light' ? 'theme-dark' : 'theme-light'
            // Cookies.set('theme', this.theme)
            setTheme(this.themeConfig.theme)
        },
    }

}
)