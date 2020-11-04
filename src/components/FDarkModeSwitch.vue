<template>
    <div class="f-dark-mode-switch">
        <f-toggle-button v-model="darkModeOn" label="Dark Mode" size="sm" />
    </div>
</template>

<script>
import FToggleButton from "@/components/core/FToggleButton/FToggleButton.vue";
export default {
    name: "FDarkModeSwitch",

    components: {FToggleButton},

    watch: {
        darkModeOn(_value) {
            const appNode = this.$root.$children[0];

            if (appNode) {
                appNode.setDarkMode(_value);
            }
        },
    },

    data() {
        return {
            darkModeOn: false,
        };
    },

    created() {
        this.darkModeOn = this.$store.state.darkMode;
    },
}
</script>

<style lang="scss">
    .f-dark-mode-switch {
        --f-dark-mode-switch-color: #{$secondary-color-lighter};

        font-size: 0.9em;
        color: var(--f-dark-mode-switch-color);
        cursor: pointer;

        .toggle-btn {
            --f-toggle-btn-background: #{$secondary-color-lighter};
        }
    }
</style>
