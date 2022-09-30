<template>
    <div class="BlogBody">
        <div class="banner"></div>

        <div class="BlogContainer">
            <BlogMenu class="BlogMenu"></BlogMenu>
            <router-view class="BlogView"></router-view>
        </div>
    </div>
    <div class="BlogFooter">
        <span>
            <div class="FootContainer">
                <div class="FootContent">
                    <p>个人博客系统</p>
                    <p>公安备案：</p>
                </div>

            </div>
        </span>

    </div>
</template>

<script setup lang="ts">
import BlogMenu from './BlogHeader/BlogMenu.vue'
import { useRouter } from 'vue-router'
import '../../SignalR/AppSignalR'
document.documentElement.setAttribute('data-theme', 'theme-light')
let router = useRouter()
router.push('/BlogIndex')

</script>
<style lang="less">
.transition {
    transition: all 0.4s ease-in-out;
}

a {
    color: inherit;
    text-decoration: inherit;
    transition-property: all;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: .15s;
    background-color: transparent;
}


.BlogContainer {
    color: var(--text-normal);
    margin: 0 auto;
    padding-left: .75rem;
    padding-right: .75rem;
    .transition();
}

.BlogBody {
    .transition();
    background-color: var(--background-primary);
    /* z-index: -2; */
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 100%;
    min-height: 1920px;
    align-items: center;
    position: relative;
    font-family: Rubik, Avenir, Helvetica, Arial, sans-serif;

    .banner {
        background: linear-gradient(130deg, rgb(36, 198, 220), rgb(84, 51, 255) 41.07%, rgb(255, 0, 153) 76.05%);
        opacity: 0.99;
        content: '';
        display: block;
        height: 600px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1;
        clip-path: polygon(100% 0,
                0 0,
                0 77.5%,
                1% 77.4%,
                2% 77.1%,
                3% 76.6%,
                4% 75.9%,
                5% 75.05%,
                6% 74.05%,
                7% 72.95%,
                8% 71.75%,
                9% 70.55%,
                10% 69.3%,
                11% 68.05%,
                12% 66.9%,
                13% 65.8%,
                14% 64.8%,
                15% 64%,
                16% 63.35%,
                17% 62.85%,
                18% 62.6%,
                19% 62.5%,
                20% 62.65%,
                21% 63%,
                22% 63.5%,
                23% 64.2%,
                24% 65.1%,
                25% 66.1%,
                26% 67.2%,
                27% 68.4%,
                28% 69.65%,
                29% 70.9%,
                30% 72.15%,
                31% 73.3%,
                32% 74.35%,
                33% 75.3%,
                34% 76.1%,
                35% 76.75%,
                36% 77.2%,
                37% 77.45%,
                38% 77.5%,
                39% 77.3%,
                40% 76.95%,
                41% 76.4%,
                42% 75.65%,
                43% 74.75%,
                44% 73.75%,
                45% 72.6%,
                46% 71.4%,
                47% 70.15%,
                48% 68.9%,
                49% 67.7%,
                50% 66.55%,
                51% 65.5%,
                52% 64.55%,
                53% 63.75%,
                54% 63.15%,
                55% 62.75%,
                56% 62.55%,
                57% 62.5%,
                58% 62.7%,
                59% 63.1%,
                60% 63.7%,
                61% 64.45%,
                62% 65.4%,
                63% 66.45%,
                64% 67.6%,
                65% 68.8%,
                66% 70.05%,
                67% 71.3%,
                68% 72.5%,
                69% 73.6%,
                70% 74.65%,
                71% 75.55%,
                72% 76.35%,
                73% 76.9%,
                74% 77.3%,
                75% 77.5%,
                76% 77.45%,
                77% 77.25%,
                78% 76.8%,
                79% 76.2%,
                80% 75.4%,
                81% 74.45%,
                82% 73.4%,
                83% 72.25%,
                84% 71.05%,
                85% 69.8%,
                86% 68.55%,
                87% 67.35%,
                88% 66.2%,
                89% 65.2%,
                90% 64.3%,
                91% 63.55%,
                92% 63%,
                93% 62.65%,
                94% 62.5%,
                95% 62.55%,
                96% 62.8%,
                97% 63.3%,
                98% 63.9%,
                99% 64.75%,
                100% 65.7%);
    }

    .BlogMenu {
        top: 0;
        z-index: 1;
    }
}

.BlogView {
    z-index: 10;
    position: relative;
    display: block;
}

.BlogFooter {
    width: 100%;
    position: relative;
    padding-top: .25rem;
    background: var(--header_gradient_css);

    span {
        justify-content: center;
        display: flex;
        background-color: var(--background-primary);

        .FootContainer {
            grid-template-rows: repeat(1, minmax(0, 1fr));
            gap: 2rem;
            width: 100%;
            color: var(--text-normal);
            padding: 1.5rem;
            margin-left: auto;
            margin-right: auto;
            font-size: .875rem;
            line-height: 1.25rem;
            height: 9rem;
            justify-content: center;
            align-items: center;
            border-radius: .5rem;
            background-color: var(--background-primary);

            .FootContent {
                grid-row: span 1/span 1;
                gap: 1.5rem;
                text-align: center;
                margin-left: auto;
                margin-right: auto;
                flex-direction: column;
                display: flex;
            }
        }
    }
}



@media (min-width: 1024px) {
    .BlogContainer {
        padding-left: 2rem;
        padding-right: 2rem;
        max-width: 1536px;
    }

    .FootContent {
        grid-template-rows: none;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        max-width: 1536px;

        .FootContent {
            grid-column: span 5/span 5;
            gap: 3rem;
            text-align: left;
            flex-direction: row;

        }
    }
}
</style>