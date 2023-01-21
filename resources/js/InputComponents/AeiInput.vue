<template>
    <div class="w-full">
        <div class="flex flex-col h-full dark:text-black">
            <InputLabel class="text-2xl mb-[10px]">
                AEI Specifications
            </InputLabel>
            <InputLabel class="mt-[10px]">
                maxFreq
            </InputLabel>
            <InputLabel v-if="maxFreqError" class="text-red-500">
                {{ errorMessages.maxFreq }}
            </InputLabel>
            <TextInput v-model="maxFreq" :value="maxFreq" v-on:blur="validateFreq()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                dbThreshold
            </InputLabel>
            <TextInput v-model="dbThreshold" :value="dbThreshold" v-on:change="onChange()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                freqStep
            </InputLabel>
            <InputLabel v-if="freqStepError" class="text-red-500">
                {{ errorMessages.freqStep }}
            </InputLabel>
            <TextInput v-model="freqStep" :value="freqStep" v-on:blur="validateFreqStep()">

            </TextInput>
            <div class="flex w-full justify-start align-baselien content-end">
                <PrimaryButton class="flex w-2/3 justify-center mt-[20px]" v-on:click="onRestoreDefault($event)">
                    Restore Defaults
                </PrimaryButton>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import ApplicationLogo from '@/Components/ApplicationLogo.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import InputLabel from '@/Components/InputLabel.vue'
import TextInput from '@/Components/TextInput.vue'

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
        ApplicationLogo,
        PrimaryButton,
        InputLabel,
        TextInput
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
        onChange: function () {
            if (!this.maxFreqError && !this.freqStepError) {
                let aei = {
                    db_threshold: this.dbThreshold,
                    freq_step: this.freqStep,
                    max_freq: this.maxFreq,
                }
                this.$emit("aeiChanged", aei)
            }
            return
        }
    }
})

</script>
