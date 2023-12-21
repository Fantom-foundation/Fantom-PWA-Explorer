<script>
export default {
    name: "BlurEffect",

    props: {
        stdDeviation: {
            type: String,
            default: '13,0',
        },
    }
}
</script>

<template>
    <svg class="blureffect" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="blurFilter">
                <feGaussianBlur
                    id="blurFilterItem"
                    in="SourceGraphic"
                    :stdDeviation="stdDeviation"
                />
            </filter>
        </defs>
    </svg>
</template>

<style lang="scss">
.blureffect {
    display: block;
    width: 0;
    height: 0;
}

.blur {
    filter: url('#blurFilter');
}
</style>
