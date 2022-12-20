<template>
    <FListbox :value="value" :focus-item-on-focus="true" :data="resolutions" :labeled-by="labeledBy" horizontal @change="$emit('change', $event)" />
</template>

<script>
import FListbox from "@/components/core/FListbox/FListbox.vue";

export default {
    name: "ChartResolutions",

    components: {FListbox},

    model: {
        prop: 'value',
        event: 'change',
    },

    props: {
        resolutions: {
            type: Array,
            default() {
                return [
                    {
                        label: this.$t('date_n.weeks', { n: 2 }),
                        value: '14d',
                    },
                    {
                        label: this.$t('date_n.month', { n: 1 }),
                        value: '1m',
                    },
                    {
                        label: this.$t('date_n.months', { n: 3 }),
                        value: '3m',
                    },
                    {
                        label: this.$t('date_n.year', { n: 1 }),
                        value: '1y',
                    },
                ]
            }
        },
        labeledBy: {
            type: String
        },
        value: {
            type: String
        }
    },

    /*data() {
        return {
            resolution: this.resolutions[0].value
        }
    }*/
}
</script>

<style scoped>

</style>
