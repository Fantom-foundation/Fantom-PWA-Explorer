<template>
    <div class="jobs-dt">
        <f-data-table
            :columns="columns"
            :items="items"
            :total-items="items.length"
            :items-per-page="20"
            :loading="loading"
            height="auto"
            use-pagination
            fixed-header
            __server-side
        >
            <template v-slot:column-tags="{ value }">
                <span class="f-chip" v-for="(tag, index) in value" :key="index">{{ tag.name }}</span>
            </template>
        </f-data-table>
    </div>
</template>

<script>
    import FDataTable from "../components/core/FDataTable/FDataTable.vue";
    import gql from 'graphql-tag';

    const columns = [
        {
            name: 'title',
            label: 'Title',
            oneLineMode: true
        },
        {
            name: 'slug',
            label: 'Slug',
            // width: '320px',
            oneLineMode: true
        },
        {
            name: 'tags',
            label: 'Tags',
            // width: '320px',
            // oneLineMode: true
        }
    ];

    export default {
        components: {
            FDataTable
        },

        apollo: {
            jobs: {
                query: gql`
                    query {
                        jobs{
                            title
                            slug
                            tags(first:5, orderBy: name_DESC){
                                name
                            }
                        }
                    }
                `
/*
                update: _data => {
                    console.log(this.items, _data);
                    // items = _data.jobs;
                    // console.log('ddddd', _data.jobs);
                }
*/
            }
        },

/*
        data() {
            return {
                loading: $apollo.loading
            }
        },
*/

        computed: {
            items() {
                return this.jobs || [];
            },

            loading() {
                return this.$apollo.queries.jobs.loading;
            }
        },

        created() {
            this.columns = columns;
            // this.fetchPolicy = 'network-only'  // 'cache-and-network', 'network-only', 'cache-first'
            // this.fetchCountries();
        },

        methods: {
/*
            async fetchCountries() {
                console.log(this.fetchPolicy);
                const result = await this.$apollo.query({
                    query: gql`
                        query {
                            jobs{
                                code
                                name
                            }
                        }
                    `,
                    fetchPolicy: this.fetchPolicy  // 'cache-and-network', 'network-only', 'cache-first'
                    // fetchResults: true
                });

                // this.$apollo.loading
                console.log(result);
                this.items = result.data.jobs;
            }
*/
        }
    }
</script>

<style lang="scss">
    .jobs-dt {
        .mobile-item {
            background-color: #fff;
            margin-bottom: 16px;
            border-radius: 8px;
            box-shadow: $elev2-shadow;
        }
    }
</style>
