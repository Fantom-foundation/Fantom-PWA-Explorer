<template>
    <div class="transactions-dt">
        <f-data-table
            :columns="columns"
            :items="items"
            :total-items="items.length"
            :items-per-page="20"
            :mobile-view="cMobileView"
            height="auto"
            fixed-header
        >
            <template v-slot:column-created="{ value, column }">
                <template v-if="column">
                    {{ value | formatDate }}
                </template>
                <template v-else>
                    {{ value | formatDate }}
                </template>
            </template>

            <template v-slot:column-id="{ value, column }">
                <div v-if="column" class="three-dots">
                    <router-link :to="`/tx/${value}`">{{ value }}</router-link>
                </div>
                <template v-else>
                    <router-link :to="`/tx/${value}`">{{ value }}</router-link>
                </template>
            </template>

            <template v-slot:column-block="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}:</div>
                    <div class="col">{{ value }}</div>
                </div>
                <template v-else>
                    {{ value }}
                </template>
            </template>

            <template v-slot:column-timeStamp="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}:</div>
                    <div class="col"><timeago :datetime="value" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago></div>
                </div>
                <template v-else>
                    <timeago :datetime="value" :auto-update="5" :converter-options="{includeSeconds: true}"></timeago>
                </template>
            </template>

            <template v-slot:column-from="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}:</div>
                    <div class="col">{{ value.name }}</div>
                </div>
                <template v-else>
                    {{ value.name }}
                </template>
            </template>

            <template v-slot:column-to="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}:</div>
                    <div class="col">{{ value.name }}</div>
                </div>
                <template v-else>
                    {{ value.name }}
                </template>
            </template>

            <template v-slot:column-amount="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}:</div>
                    <div class="col">{{ WEIToFTM(value) }} FTM</div>
                </div>
                <template v-else>
                    {{ WEIToFTM(value) }} FTM
                </template>
            </template>

            <template v-slot:column-fee="{ value, column }">
                <div v-if="column" class="row no-collapse no-vert-col-padding">
                    <div class="col-4 f-row-label">{{ column.label }}:</div>
                    <div class="col">{{ WEIToFTM(value) }} FTM</div>
                </div>
                <template v-else>
                    {{ WEIToFTM(value) }} FTM
                </template>
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
                    "block": 73898,
                    "fee":"23300000000000",
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
                    "block": 73898,
                    "fee":"49271000000000",
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
                    "block": 73898,
                    "fee":"21000000000000",
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
                    "block": 73898,
                    "fee":"21000000000000",
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
                    "block": 73898,
                    "fee":"21000000000000",
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

        computed: {
            columns() {
                return [
                    {
                        name: 'created',
                        readValueFrom: 'timeStamp',
                        hidden: !this.cMobileView
                    },
                    {
                        name: 'id',
                        label: this.$t('transaction_list.tx_hash'),
                        oneLineMode: true
                    },
                    {
                        name: 'block',
                        label: this.$t('transaction_list.block'),
                        width: '100px',
                        hidden: this.cMobileView
                    },
                    {
                        name: 'timeStamp',
                        label: this.$t('transaction_list.age'),
                        width: '220px',
                        hidden: this.cMobileView
                    },
                    {
                        name: 'from',
                        label: this.$t('transaction_list.from'),
                        width: '180px'
                    },
                    {
                        name: 'to',
                        label: this.$t('transaction_list.to'),
                        width: '180px'
                    },
                    {
                        name: 'amount',
                        label: this.$t('transaction_list.amount'),
                        width: '130px'
                    },
                    {
                        name: 'fee',
                        label: this.$t('transaction_list.fee')
                    }
                ]
            },

            items() {
                return tmpData.data.burst || [];
            },

            /**
             * Property is set to `true`, if 'ttransaction-list-dt-mobile-view' breakpoint is reached.
             *
             * @return {Boolean}
             */
            cMobileView() {
                const dataTableBreakpoint = this.$store.state.breakpoints['transaction-list-dt-mobile-view'];

                return (dataTableBreakpoint && dataTableBreakpoint.matches);
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
/*
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
*/
</style>
