import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('Search', {
    state:()=>{
        return {
            OpenSearch:false
        }
    },
    actions:{
        ChangeOpenSearch(Visible:boolean){
            this.OpenSearch=Visible
            console.log(this.OpenSearch)
        }
    }
})