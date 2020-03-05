<template>
    <div class="transactions-dt">
        <f-data-table
            :columns="columns"
            :items="items"
            :total-items="items.length"
            :items-per-page="20"
            height="auto"
            __use-pagination
            fixed-header
        >
            <template v-slot:column-timeStamp="{ value, column }">
                <div v-if="column">
                    <span class="column-label">{{ column.label }}:</span> &nbsp;
                    <span><timeago :datetime="value" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago></span>
                </div>
                <div v-else>
                    <timeago :datetime="value" :auto-update="5" :converter-options="{includeSeconds: true}"></timeago>
                </div>
            </template>

            <template v-slot:column-amount="{ value, column }">
                <div v-if="column">
                    <span class="column-label">{{ column.label }}:</span> <span>{{ WEIToFTM(value) }}</span>
                </div>
                <div v-else>
                    {{ WEIToFTM(value) }}
                </div>
            </template>

            <template v-slot:column-from="{ value, column }">
                <div v-if="column">
                    <span class="column-label">{{ column.label }}:</span> <span>{{ value.name }}</span>
                </div>
                <div v-else>
                    {{ value.name }}
                </div>
            </template>

            <template v-slot:column-to="{ value, column }">
                <div v-if="column">
                    <span class="column-label">{{ column.label }}:</span> <span>{{ value.name }}</span>
                </div>
                <div v-else>
                    {{ value.name }}
                </div>
            </template>

            <template v-slot:column-id="{ value, column }">
                <div v-if="column">
                    <span class="column-label">{{ column.label }}:</span> <span><router-link :to="`/tx/${value}`">{{ value }}</router-link></span>
                </div>
                <div v-else>
                    <router-link :to="`/tx/${value}`">{{ value }}</router-link>
                </div>
            </template>
        </f-data-table>
    </div>
</template>

<script>
    import FDataTable from "../components/FDataTable.vue";
    import { WEIToFTM } from "../utils/transactions.js";

    const tmpData = {
        "data":{
            "burst":[
                {
                    "id":"0xb63debdf2a72b0653c5b4018ec3b785f3342474a423ec4acb0367a86247cef8d",
                    "from":{
                        "id":"54",
                        "name":"Pearl",
                        "__typename":"Account"
                    },
                    "to":{
                        "id":"11",
                        "name":"Aquamarine",
                        "__typename":"Account"
                    },
                    "amount":"80000000000000000",
                    "timeStamp":"2020-03-04T15:19:36.248306248+01:00",
                    "__typename":"Transaction"
                },
                {
                    "id":"0xc523d34f0667eb854c08580b53c6739b1133bd0749aed1f045a5e64b3c1d115d",
                    "from":{
                        "id":"54",
                        "name":"Pearl",
                        "__typename":"Account"
                    },
                    "to":{
                        "id":"1",
                        "name":"Amaranth",
                        "__typename":"Account"
                    },
                    "amount":"80000000000000000",
                    "timeStamp":"2020-03-04T13:30:56.271151761+01:00",
                    "__typename":"Transaction"
                },
                {
                    "id":"0x6f6c47b5a2be4e51aaa041f35b84e306b5b0bfb4eb41b883918b7973134cf934",
                    "from":{
                        "id":"54",
                        "name":"Pearl",
                        "__typename":"Account"
                    },
                    "to":{
                        "id":"43",
                        "name":"Alexandrite",
                        "__typename":"Account"
                    },
                    "amount":"80000000000000000",
                    "timeStamp":"2020-03-04T13:30:56.295990851+01:00",
                    "__typename":"Transaction"
                },
                {
                    "id":"0xc49cca8cbfbef1339b88b38e96d617ae91341f2e996077680f8722deec3180c9",
                    "from":{
                        "id":"54",
                        "name":"Pearl",
                        "__typename":"Account"
                    },
                    "to":{
                        "id":"62",
                        "name":"Hypersthene",
                        "__typename":"Account"
                    },
                    "amount":"80000000000000000",
                    "timeStamp":"2020-03-04T13:30:56.318284912+01:00",
                    "__typename":"Transaction"
                },
                {
                    "id":"0xdbbf36aee263b33981fbc629fd150a88ccf5b169f1ba5cec005246a77b7f29f6",
                    "from":{
                        "id":"54",
                        "name":"Pearl",
                        "__typename":"Account"
                    },
                    "to":{
                        "id":"36",
                        "name":"Yellow Turqoise",
                        "__typename":"Account"
                    },
                    "amount":"80000000000000000",
                    "timeStamp":"2020-03-04T13:30:56.341292701+01:00",
                    "__typename":"Transaction"
                }
            ]
        }
    };

    export default {
        components: {
            FDataTable
        },

        data() {
            return {
                columns: [
                    {
                        name: 'timeStamp',
                        label: this.$t('transaction_list.created'),
                        width: '220px',
                        oneLineMode: true
                    },
                    {
                        name: 'amount',
                        label: this.$t('transaction_list.amount'),
                        width: '130px',
                        css: {
                            textAlign: 'right'
                        },
                        oneLineMode: true
                    },
                    {
                        name: 'from',
                        label: this.$t('transaction_list.from'),
                        width: '200px',
                        oneLineMode: true
                    },
                    {
                        name: 'to',
                        label: this.$t('transaction_list.to'),
                        width: '200px',
                        css: {
                            textAlign: 'center'
                        },
                        oneLineMode: true
                    },
                    {
                        name: 'id',
                        label: this.$t('transaction_list.tx_hash'),
                        // width: '30%',
                        oneLineMode: true
                    }
                ]
            }
        },

        computed: {
            items() {
                return tmpData.data.burst || [];
            }
        },

/*
        created() {
            this.columns = columns;
        },
*/

        methods: {
            WEIToFTM
        }
    }
</script>

<style lang="scss">
    /*@import "../assets/scss/vars";*/
    .transactions-dt {
        .f-data-table {
            .mobile-view {
                .mobile-item {
                    > div._c2, > div._c3 {
                        display: inline-block;
                        width: 50% !important;
                        min-width: 50% !important;
                    }
                }
            }
        }
    }
</style>
