<template>
    <div class="narrow-container">
        <div class="row">
            <div class="col">
                <f-card>
                    <h3>Buttons</h3>
                    <h4>Default</h4>
                    <p>
                        <button class="large">Large</button> <button>Default</button> <button class="small">Small</button>
                    </p>
                    <h4>Secondary</h4>
                    <p>
                        <button class="secondary large">Large</button> <button class="secondary">Default</button> <button class="secondary small">Small</button>
                    </p>
                    <h4>Light</h4>
                    <p>
                        <button class="light large">Large</button> <button class="light">Default</button> <button class="light small">Small</button>
                    </p>
                </f-card>
            </div>
        </div>
    </div>
</template>

<script>
    import FCard from "../components/FCard.vue";

    export default {
        components: {
            FCard
        }
    }
</script>

<style>

</style>
