<template>
    <div class="w-full">
        <div class="flex flex-col h-full dark:text-black">
            <jet-label class="text-2xl mb-[10px]">
                ADI Specifications
            </jet-label>
            <jet-label class="mt-[10px]">
                maxFreq
            </jet-label>
            <jet-label v-if="maxFreqError" class="text-red-500">
                {{errorMessages.maxFreq}}
            </jet-label>
            <jet-input v-on:blur="validateFreq()" :value="maxFreq" v-model="maxFreq">

            </jet-input>
            <jet-label class="mt-[10px]">
                dbThreshold
            </jet-label>
            <jet-input :value="dbThreshold" v-on:change="onChange()" v-model="dbThreshold">

            </jet-input>
            <jet-label class="mt-[10px]">
                freqStep
            </jet-label>
            <jet-label v-if="freqStepError" class="text-red-500">
                {{errorMessages.freqStep}}
            </jet-label>
            <jet-input v-on:blur="validateFreqStep()" :value="freqStep" v-model="freqStep">

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
                    maxFreq: 10000,
                    dbThreshold: -50,
                    freqStep: 1000,
                    shannon: true
                };
    const errorMessages = {
        maxFreq: "maxFreq must be an integer greater than or equal to 0",
        freqStep: "freqStep must be an integer greater than or equal to 1",
    }
    let maxFreq = specificationDefaults.maxFreq
    let dbThreshold = specificationDefaults.dbThreshold
    let freqStep = specificationDefaults.freqStep
    let maxFreqError = false
    let freqStepError = false

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
                maxFreq,
                dbThreshold,
                freqStep,
                freqStepError,
                maxFreqError,
                errorMessages
            }
        },
        methods: {
            onRestoreDefault: function (event) {
                this.maxFreq = specificationDefaults.maxFreq
                this.dbThreshold = specificationDefaults.dbThreshold
                this.freqStep = specificationDefaults.freqStep
                this.maxFreqError = false
                this.freqStepError = false
                this.onChange();
            },
            validateFreq: function () {
                if (isNaN(this.maxFreq)) {
                    this.maxFreqError = true
                    return
                } else if (this.maxFreq < 0) {
                    this.maxFreqError = true
                    return
                }
                this.maxFreqError = false;
                this.onChange();
                return
            },
            validateFreqStep: function () {
                if (isNaN(this.freqStep)) {
                    this.freqStepError = true
                    return
                } else if (this.freqStep < 1) {
                    this.freqStepError = true
                    return
                }
                this.freqStepError = false;
                this.onChange();
                return
            },
            onChange: function(){
                if(!this.maxFreqError && !this.freqStepError)
                {
                    let adi = {
                        db_threshold: this.dbThreshold,
                        freq_step: this.freqStep,
                        max_freq: this.maxFreq,
                    }
                    this.$emit("adiChanged", adi)
                }
                return
            }

        }
    } )

</script>
