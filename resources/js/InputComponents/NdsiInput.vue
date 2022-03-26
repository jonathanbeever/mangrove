<template>
    <div class="w-full">
        <div class="flex flex-col h-full">
            <jet-label class="text-2xl mb-[10px]">
                Set Specifications
            </jet-label>
            <jet-label class="mt-[10px]">
                anthroMin
            </jet-label>
            <jet-label v-if="anthroMinError" class="text-red-500">
                {{errorMessages.anthroMin}}
            </jet-label>
            <jet-input v-on:blur="validateAnthroMin()" :value="anthroMin" v-model="anthroMin">

            </jet-input>
            <jet-label class="mt-[10px]">
                anthroMax
            </jet-label>
            <jet-label v-if="anthroMaxError" class="text-red-500">
                {{errorMessages.anthroMax}}
            </jet-label>
            <jet-input v-on:blur="validateAnthroMax()" :value="anthroMax" v-model="anthroMax">

            </jet-input>
            <jet-label class="mt-[10px]">
                bioMin
            </jet-label>
            <jet-label v-if="bioMinError" class="text-red-500">
                {{errorMessages.biomin}}
            </jet-label>
            <jet-input v-on:blur="validateBioMin()" :value="bioMin" v-model="bioMin">

            </jet-input>
            <jet-label class="mt-[10px]">
                bioMax
            </jet-label>
            <jet-label v-if="bioMaxError" class="text-red-500">
                {{errorMessages.bioMax}}
            </jet-label>
            <jet-input v-on:blur="validateBioMax()" :value="bioMax" v-model="bioMax">

            </jet-input>
            <jet-label class="mt-[10px]">
                MW
            </jet-label>
            <jet-label v-if="mwError" class="text-red-500">
                {{errorMessages.mW}}
            </jet-label>
            <jet-input v-on:blur="validateMw()" :value="mW" v-model="mW">

            </jet-input>
            <div class="flex w-full justify-start align-baselien content-end">
                <jet-button class="flex w-2/3 justify-center mt-[20px]" v-on:click="onRestoreDefault($event)">
                    Restore Defaults
                </jet-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import JetApplicationLogo from '@/Jetstream/ApplicationLogo.vue'
    import JetButton from '@/Jetstream/Button.vue'
    import JetLabel from '@/Jetstream/Label.vue'
    import JetInput from '@/Jetstream/Input.vue'

    const specificationDefaults = {
                    anthroMin: 1000,
                    anthroMax: 2000,
                    bioMin: 2000,
                    bioMax: 11000,
                    mW: 1024
                };
    const errorMessages = {
        anthroMin: "anthroMin must be an integer greater than 0",
        anthroMax: "anthroMax must be an integer greater than 0",
        bioMin: "bioMin must be an integer greater than 0",
        bioMax: "bioMax must be an integer greater than 0",
        mW: "MW must be an integer greater than 0"
    }
    let anthroMin = specificationDefaults.anthroMin
    let anthroMax = specificationDefaults.anthroMax
    let bioMin = specificationDefaults.bioMin
    let bioMax = specificationDefaults.bioMax
    let mW = specificationDefaults.mW
    let anthroMinError = false
    let anthroMaxError = false
    let bioMinError = false
    let bioMaxError = false
    let mwError = false

    export default defineComponent({
        components: {
            JetApplicationLogo,
            JetButton,
            JetLabel,
            JetInput
        },
        data: function () {
            return {
                specificationDefaults,
                anthroMin,
                anthroMax,
                bioMin,
                bioMax,
                mW,
                anthroMinError,
                anthroMaxError,
                bioMinError,
                bioMaxError,
                mwError,
                errorMessages
            }
        },
        methods: {
            onRestoreDefault: function (event) {
                this.anthroMin = specificationDefaults.anthroMin
                this.anthroMax = specificationDefaults.anthroMax
                this.bioMin = specificationDefaults.bioMin
                this.bioMax = specificationDefaults.bioMax
                this.mW = specificationDefaults.mW
            },
            validateAnthroMin: function () {
                if (isNaN(this.anthroMin)) {
                    this.anthroMinError = true
                    return
                } else if (this.anthroMin < 0) {
                    this.anthroMinError = true
                    return
                }
                this.anthroMinError = false;
                return
            },
            validateAnthroMax: function () {
                if (isNaN(this.anthroMax)) {
                    this.anthroMaxError = true
                    return
                } else if (this.anthroMax < 0) {
                    this.anthroMaxError = true
                    return
                }
                this.anthroMaxError = false;
                return
            },
            validateBioMin: function () {
                if (isNaN(this.bioMin)) {
                    this.bioMinError = true
                    return
                } else if (this.bioMin < 0) {
                    this.bioMinError = true
                    return
                }
                this.bioMinError = false;
                return
            },
            validateBioMax: function () {
                if (isNaN(this.bioMax)) {
                    this.bioMaxError = true
                    return
                } else if (this.bioMax < 0) {
                    this.bioMaxError = true
                    return
                }
                this.bioMaxError = false;
                return
            },
            validateMw: function () {
                if (isNaN(this.mW)) {
                    this.mwError = true
                    return
                } else if (this.mW < 0) {
                    this.mwError = true
                    return
                }
                this.mwError = false;
                return
            }
        }
    } )

</script>
