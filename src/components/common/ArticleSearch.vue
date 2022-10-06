<template>
    <Dialog v-model="refSearchStore.OpenSearch.value">
        <div class="SearchCSS">
            <a-input class="search-Input" v-model:value="Refvalue" placeholder="search by Elastic Search"
                @change="Searchfunc">
                <template #prefix>
                    <search-outlined type="search" />
                </template>
            </a-input>
            <div class="search-show">
                <div>
                    <section>
                        <div class="search-count">Found {{TotalCount}} records</div>
                        <ul>
                            <li v-for="result in searchResults" :key="result.id">
                                <a @click="jumpToDetail(result.id)">
                                    <div class="search-li-container">
                                        <div class="search-li-icon">
                                            <search-outlined type="search" />
                                        </div>
                                        <div class="search-li-content">
                                            <span class="search-li-title" v-html="result.title"></span>
                                            <span class="search-li-text" v-html="result.content"></span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>

    </Dialog>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue'
import { useSearchStore } from '../../Store/SearchStore'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
import Dialog from './Dialog.vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { ArticleSearch } from '../../Entities/E_Search'
import SearchService from '../../Services/SearchService'

let router = useRouter()

const SearchStore = useSearchStore();
const refSearchStore = storeToRefs(SearchStore)


let Refvalue = ref('')
const resultArray: Array<any> = [];
let searchResults = ref(resultArray)
let TotalCount = ref(0)
const Searchfunc = () => {
    if (Refvalue.value == '') return;
    const Search = new ArticleSearch()
    Search.keyword = Refvalue.value
    Search.pageSize = 20
    SearchService.prototype.SearchArticle(Search).then(ret => {
        searchResults.value = ret.searchResult;
        TotalCount.value = ret.totalCount;
    })
}
const jumpToDetail = (id: string) => {
    router.push({
        path: '/ShowArticle/' + id
    })
    refSearchStore.OpenSearch.value = false
}
const handleOk = (e: MouseEvent) => {
    console.log(e);
};

</script>

<style lang="less">
.SearchCSS {
    max-width: 40rem;

    .search-Input {
        border-radius: 4px;
        size: 2rem;
        font-size: 1.5rem;

        &hover {
            background-color: red;
        }
    }



    .search-show {
        margin-top: 0.5rem;
        overflow-y: auto;
        padding-left: 1rem;
        padding-right: 1rem;
        min-height: var(--search-modal-spacing);
        max-height: 30rem;

        &::-webkit-scrollbar {
            width: 0.5rem;
            background: var(--header_gradient_css);
            border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background-color: white;
        }

        .search-count {
            background-color: var(--background-primary);
            font-weight: 600;
            font-size: .875rem;
            line-height: 1.25rem;
            padding-left: 0.25rem;
            padding-right: 0.25rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            position: sticky;
            top: 0;
            color: var(--text-accent);
            z-index: 10;
        }

        section {
            ul {
                li {
                    border-radius: .25rem;
                    display: flex;
                    padding-bottom: .5rem;
                    position: relative;
                    text-align: -webkit-match-parent;

                    :active {
                        background-color: var(--text-accent);
                    }

                    a {
                        background-color: var(--background-secondary);
                        border-color: var(--background-secondary);
                        border-radius: 0.5rem;
                        border-width: 2px;
                        box-sizing: border-box;
                        display: block;
                        padding-left: 0.75rem;
                        --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06);
                        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                        content: "";
                        width: 100%;

                        .search-li-container {
                            display: flex;
                            align-items: center;
                            height: 3.5rem;
                            padding-right: 0.75rem;
                            color: var(--text-normal);

                            .search-li-icon {
                                stroke-width: 2;
                                color: var(--text-dim);
                            }

                            .search-li-content {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                flex: 1 1 auto;
                                font-weight: 500;
                                margin-left: 0.5rem;
                                margin-right: 0.5rem;
                                overflow: hidden;
                                position: relative;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                // width: 80%;

                                .search-li-title {
                                    font-size: .75rem;
                                    line-height: 1rem;
                                    color: var(--text-dim);
                                }

                                .search-li-text {
                                    font-size: .875rem;
                                    line-height: 1.25rem;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    // width: 91.666667%;

                                    em {
                                        font-size: large;
                                        color: var(--text-accent);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}
</style>