<template>
    <div class="narrow-container">
        <div class="test-controls">
            <button @click="onNewItemsClick">Set new items</button>
            <button @click="onNoItemsClick">No items</button>
            <button @click="onPushClick">Push item</button>
            <button @click="onPrependClick">Prepend item</button>
            <button @click="onUpdateClick">Update item on index 1</button>
            <button @click="onUpdateCellClick">Update cell on index 1</button>
            <button @click="onMobileViewClick">Toggle mobile view</button>
        </div>

        <f-data-table
            :columns="columns"
            :items="items"
            :total-items="items.length"
            :items-per-page="20"
            :mobile-view="mobileView"
            height="400px"
            use-pagination
            fixed-header
            class="f-data-table-body-bg-color"
        >
            <template v-slot:before-table>
                <div style="text-align: end;padding-bottom: 4px;">
                    <h3>Complex data table</h3>
                    <f-pagination
                        :total-items="items.length"
                        :items-per-page="20"
                        @page-change="onPageChange"
                    >
                        <template v-slot:pages="{ data }">
                            {{ data.currPage }} / {{ data.numPages }} ({{ data.totalItems }})
                        </template>
                    </f-pagination>
                </div>
            </template>

            <template v-slot:after-table>
                <div>After table slot</div>
            </template>

            <template v-slot:column-country_name="{ value, column }">
                <div v-if="column">
                    <span class="column-label">{{ column.label }}</span> <span><a href="#">{{ value }}</a></span>
                </div>
                <div v-else>
                    <a href="#">{{ value }}</a>
                </div>
            </template>

            <template v-slot:column-country_code="{ value, column }">
                <div v-if="column">
                    <span class="column-label">{{ column.label }}</span> {{ value }}
                </div>
                <div v-else>
                    <div class="tpl-test">{{ value }}</div>
                </div>
            </template>
        </f-data-table>

        <h3>Data table with no items</h3>
        <f-data-table
            :columns="columns"
            class="f-data-table-body-bg-color"
        >
            <!--            <template v-slot:no-items>No itemo</template>-->
        </f-data-table>

        <f-data-table
            :columns="columns"
            :items="items"
            :total-items="items.length"
            :items-per-page="20"
            fixed-header
            class="f-data-table-body-bg-color"
        >
            <template v-slot:before-table>
                <h3>Default data table</h3>
            </template>
            <template v-slot:after-table>
                <div>After table slot</div>
            </template>
        </f-data-table>
    </div>
</template>

<script>
    import FDataTable from "../components/core/FDataTable/FDataTable.vue";
    import FPagination from "../components/FPagination.vue";
    import {cloneObject} from "../utils/index.js";
    import shortid from 'shortid';

    const columns = [
        {
            name: 'num',
            label: 'Num',
            width: '50px'
            // minWidth: '300px'
        },
        {
            name: 'country_name',
            label: 'Country name',
            // width: '200px',
            // minWidth: '200px',
            oneLineMode: true,
            css: {
                textAlign: 'center'
            }
        },
        {
            name: 'country_code',
            label: 'Country code',
            width: '300px'
            // minWidth: '300px'
        }
    ];

    const items = [
        {
            country_name: 'Czech republic',
            country_code: 'cz'
        },
        {
            country_name: 'Slovakia',
            country_code: 'sk',
            css: {
                color: '#fff',
                backgroundColor: '#888'
            }
        },
        {
            country_name: 'Poland',
            country_code: 'pl'
        }
    ];

    for (let i = 0; i < 50; i++) {
        items.push({
            country_name: shortid.generate(),
            country_code: shortid.generate().slice(2)
        })
    }

    const items2 = [
        {
            country_name: 'Deutchland',
            country_code: 'de'
        },
        {
            country_name: 'USA',
            country_code: 'us'
        }
    ];

    for (let i = 0, len1 = items.length; i < len1; i++) {
        items[i].num = i;
    }

    export default {
        components: {
            FDataTable,
            FPagination
        },

        data() {
            return {
                items: cloneObject(items),
                mobileView: false
            }
        },

        created() {
            this.columns = columns;
            // this.items = items;
        },

        mounted() {
            // console.log(this.$route);
        },

        methods: {
            onPageChange(_data) {
                console.log('PAGE CHANGEd', _data);
            },

            onNewItemsClick() {
                this.items = cloneObject(items2);
            },

            onNoItemsClick() {
                this.items = [];
            },

            onPushClick() {
                this.items.push({
                    country_name: 'Argentina',
                    country_code: 'ar'
                });
                // this.items = items2;
            },

            onPrependClick() {
                this.items.unshift({
                    country_name: 'Canada',
                    country_code: 'ca'
                });
                // this.items = items2;
            },

            onUpdateClick() {
                this.$children[0].updateRow(1, {
                    country_name: 'Chile',
                    country_code: 'cl',
                    css: {
                        color: '#fff',
                        backgroundColor: 'green'
                    }
                });
            },

            onUpdateCellClick() {
                this.$children[0].updateCell(1, 'country_code', 'UPDATED CODE');
            },

            onMobileViewClick() {
                this.mobileView = !this.mobileView;
            }
        }
    }
</script>

<style lang="scss">
    .test-controls {
        margin-bottom: 1rem;

        button {
            margin-inline-end: 4px;
            margin-bottom: 4px;
        }
    }

    .tpl-test {
        color: #fff;
        background-color: #00B7FF;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
    }
</style>
