<template>
    <div class="claim-rewards-info-window">
        <f-window
            ref="window"
            modal
            style="max-width: 700px;"
            title="Select Address"
            animation-in="scale-center-enter-active"
            animation-out="scale-center-leave-active"
            class="tmp-info-window"
            :hide-on-escape-key="false"
            :with-header="false"
            :z-index="15"
            @window-hide="$emit('window-hide', $event)"
        >
            <h2>Claim your rewards!</h2>
            <p>To participate in Fluid Staking, please claim your outstanding rewards.</p>
            <p>
                Please note that the wallet is still under mainteinance and some data regarding staking and totals might
                not be accurate for the duration of the mainteinance.
            </p>
            <p>We apologize for any inconvenience!</p>
            <p>
                Even if your pending rewards balance shows 0, go ahead and claim anyway and you’ll receive the correct
                amount.
            </p>
            <p class="align-center">
                <button class="btn large" @click="onBtnClick">Ok, understood</button>
            </p>
        </f-window>
    </div>
</template>

<script>
import FWindow from "@/components/core/FWindow/FWindow.vue";
export default {
    name: 'TemporaryMessageWindow',

    components: { FWindow },

    mounted() {
        if (!window.localStorage.getItem('tmp-msg')) {
            this.$refs.window.show();
        }
    },

    methods: {
        onBtnClick() {
            this.$refs.window.hide();
            window.localStorage.setItem('tmp-msg', true);
        },
    },
};
</script>

<style lang="scss">
@import 'style';
</style>
