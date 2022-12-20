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
                        label: '2 Weeks',
                        value: '14d',
                    },
                    {
                        label: '1 Month',
                        value: '1m',
                    },
                    {
                        label: '3 Months',
                        value: '3m',
                    },
                    {
                        label: '1 Year',
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
