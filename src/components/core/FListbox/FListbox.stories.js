import { withA11y } from '@storybook/addon-a11y';

import FListbox from './FListbox.vue';
import FButton from '../FButton/FButton.vue';
import FAriaAlert from '../FAriaAlert/FAriaAlert.vue';

const data = [
    { label: 'item 1', value: '10' },
    { label: 'item 2', id: 'myid', value: '20' },
    { label: 'item 3', value: '30' },
    { label: 'item 4', value: '40' },
    { label: 'item 5', value: '50' },
    { label: 'item 6', value: '60' },
];

const data2 = [];

for (let i = 1; i < 200; i++) {
    data2.push({
        label: `item ${i}`,
        value: `${i * 10}`,
    });
}

export default {
    title: 'FListbox',
    component: FListbox,
    decorators: [withA11y],
};

export const Default = () => ({
    components: { FListbox },
    template: `
        <div>
            <f-listbox :data="data" label="Listbox label" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: [...data],
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const SelectedItem = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl22" class="not-visible">Listbox example</span>
            <f-listbox :data="data" labeled-by="fllbl22" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: data.map((_item, _idx) => (_idx === 3 ? { ..._item, selected: true } : _item)),
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const Value = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl22" class="not-visible">Listbox example</span>
            <f-listbox value="30" :data="data" labeled-by="fllbl22" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: [...data],
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const CircularKeyboardNavigation = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl22" class="not-visible">Listbox example</span>
            <f-listbox :circular-navigation="true" :data="data" labeled-by="fllbl22" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: [...data],
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const Disabled = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl23" class="not-visible">Listbox example</span>
            <f-listbox disabled :data="data" :circular-navigation="true" labeled-by="fllbl23" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: [...data],
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const DisabledItems = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl2" class="not-visible">Listbox example</span>
            <f-listbox :data="data" :circular-navigation="true" labeled-by="fllbl2" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: data.map((_item, _idx) =>
                _idx === 0 || _idx === 3 || _idx === 4 ? { ..._item, disabled: true } : _item
            ),
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const CustomSlot = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl3" class="not-visible">Listbox example</span>
            <f-listbox :data="data" labeled-by="fllbl3" @component-change="onListboxItemSelected">
                <template v-slot="{ item }">
                    &#9733; <b>{{ item.label }}</b>
                </template>
            </f-listbox>
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: [...data],
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const SelectImmediately = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl4" class="not-visible">Listbox example</span>
            <f-listbox :select-immediately="true" :data="data" labeled-by="fllbl4" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: [...data],
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const FocusItem = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl4" class="not-visible">Listbox example</span>
            <f-listbox :focus-item-on-focus="true" :data="data" labeled-by="fllbl4" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: [...data],
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const Scrollable = () => ({
    components: { FListbox },
    template: `
        <div>
            <span id="fllbl4" class="not-visible">Listbox example</span>
            <f-listbox :data="data" :focus-item-on-focus="true" labeled-by="fllbl4" @component-change="onListboxItemSelected" style="max-height: 300px; overflow: auto;" />
            <br />
            Selected: {{ selectedItem }}
        </div>
    `,
    data() {
        return {
            data: [...data2],
            selectedItem: '',
        };
    },
    methods: {
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const Validation = () => ({
    components: { FListbox, FButton, FAriaAlert },
    template: `
        <div>
            <form action="" @submit="onSubmit">
                <f-listbox
                    :validator="validator"
                    validate-on-change
                    @validation-state="_state => submitDisabled = _state.invalid "
                    ref="listbox"
                    :data="data"
                />
                <br /><br />
                <f-button type="submit" size="small" :disabled="submitDisabled">Submit</f-button>
            </form>

            <f-aria-alert />
        </div>
    `,
    data() {
        return {
            data: [...data],
            submitDisabled: false,
        };
    },
    methods: {
        validator(_value) {
            if (!_value) {
                return 'Select an option';
            } else if (_value === '20') {
                return 'Select another option';
            }

            return '';
        },
        onSubmit(_event) {
            this.$refs.listbox.validate();

            _event.preventDefault();
        },
    },
});

export const Model = () => ({
    components: { FListbox, FButton },
    template: `
        <div>
            <span id="fllbl5" class="not-visible">Listbox example</span>
            <f-listbox v-model="value" :focus-item-on-focus="true" :data="data" labeled-by="fllbl5" @component-change="onListboxItemSelected" />
            <br />
            Selected: {{ value }}
            <f-button secondary size="small" @click.native="onButtonClick">Set value to '30'</f-button>
        </div>
    `,
    data() {
        return {
            data: [...data],
            value: '',
        };
    },
    methods: {
        onButtonClick() {
            this.value = '30';
        },
        onListboxItemSelected(_item) {
            this.selectedItem = _item.label;
        },
    },
});

export const Slots = () => ({
    components: { FListbox },
    template: `
        <div>
            <f-listbox :data="data" :focus-item-on-focus="true">
                <template #top>Top</template>
                <template #bottom>Bottom</template>
            </f-listbox>
        </div>
    `,
    data() {
        return {
            data: [...data],
        };
    },
});

export const InfoText = () => ({
    components: { FListbox },
    template: `
        <div>
            <f-listbox info-text="Info text" label="Label" :data="data" :focus-item-on-focus="true" />
        </div>
    `,
    data() {
        return {
            data: [...data],
        };
    },
});
