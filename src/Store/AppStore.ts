import { ref, getCurrentInstance } from 'vue'
import { defineStore } from 'pinia'
import { BlogParam } from '../Entities/E_BlogParam'
import BlogInfoService from '../Services/BlogInfoService'
import UploadService from '../Services/UploadService'
import * as signalR from "@microsoft/signalr";





const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme)
}

let BlogParamArray: BlogParam[] = [];

export const useAppStore = defineStore('AppStore', {
    state: () => {
        return {
            themeConfig: {
                theme: 'theme-light',
                header_gradient_css: 'var(--header_gradient_css)'
            },
            AllBlogParam: BlogParamArray,
            BackGroudImgUrl: ''
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
        }
    },
    actions: {
        async GetAllParameter() {
            this.AllBlogParam = await BlogInfoService.prototype.GetAllBlogParameters();
        },
        GetParameterValue(paramName: string) {

            if (this.AllBlogParam.length == undefined || this.AllBlogParam.length == 0) return '';
            return this.AllBlogParam.find(x => x.paramName == paramName)?.paramValue;
        },

        toggleTheme(isDark?: boolean) {
            this.themeConfig.theme =
                isDark === true || this.themeConfig.theme === 'theme-light' ? 'theme-dark' : 'theme-light'
            // Cookies.set('theme', this.theme)
            setTheme(this.themeConfig.theme)
        },

        SetBannerImg(pictureId: string) {
            if (pictureId != '')
                this.BackGroudImgUrl = UploadService.prototype.getImageUri() + pictureId
            else
                this.BackGroudImgUrl = ''
        }
    }

}
)