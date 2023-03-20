<template>
    <div class="w-full">
        <div class="flex flex-col h-full dark:text-black">
            <InputLabel class="text-2xl mb-[10px]">
                Acoustic Filter Specifications
            </InputLabel>
            <InputLabel class="mt-[10px]">
                Acoustic Index ('ACI','AEI','ADI','BI','NDSI')
            </InputLabel>
            <InputLabel v-if="soundindexError" class="text-red-500">
                {{ errorMessages.soundindex }}
            </InputLabel>
            <TextInput v-model="soundindex" :value="soundindex" v-on:blur="validateSoundIndex()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                max_val
            </InputLabel>
            <InputLabel v-if="max_valError" class="text-red-500">
                {{ errorMessages.max_val }}
            </InputLabel>
            <TextInput v-model="max_val" :value="max_val" v-on:blur="validateMax_val()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                timeStep
            </InputLabel>
            <InputLabel v-if="timeStepError" class="text-red-500">
                {{ errorMessages.timeStep }}
            </InputLabel>
            <TextInput v-model="timeStep" :value="timeStep" v-on:blur="validateTimeStep()">

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
    soundindex: 'ADI',
    max_val: 10,
    timeStep: 3
};
const errorMessages = {
    soundindex: "soundindex must be a string of the form ['ACI','ADI','AEI','BI','NDSI']",
    max_val: "max_val must be an integer greater than 0",
    timeStep: "timeStep must be an integer greater than or equal to 2"
}
let soundindex = specificationDefaults.soundindex
let max_val = specificationDefaults.max_val
let timeStep = specificationDefaults.timeStep
let soundindexError = false;
let max_valError = false;
let timeStepError = false;

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
            soundindex,
            max_val,
            timeStep,
            errorMessages,
            soundindexError,
            max_valError,
            timeStepError
        }
    },
    methods: {
        onRestoreDefault: function (event) {
            this.soundindex = specificationDefaults.soundindex;
            this.max_val = specificationDefaults.max_val;
            this.timeStep = specificationDefaults.timeStep;
            this.soundindexError = false
            this.max_valError = false
            this.timeStepError = false
            this.onChange();
        },
        validateSoundIndex: function() {
            if (!['ACI','ADI','AEI','BI','NDSI'].includes(this.soundindex)) {
                this.soundindexError = true
                return
            }
            this.soundindexError = false
            this.onChange();
            return
        },
        validateMax_val: function () {
            if (isNaN(max_val)) {
                this.max_valError = true
                return
            } else if (this.max_val < 0 ) {
                this.max_valError = true
                return
            }
            
            this.max_valError = false;
            this.onChange();
            return
        },
        validateTimeStep: function () {
            if (isNaN(this.timeStep)) {
                this.timeStepError = true
                return
            } else if (this.timeStep < 2) {
                this.timeStepError = true
                return
            }
            this.timeStepError = false;
            this.onChange();
            return
        },
        onChange: function () {
            if (!this.soundindexError && !this.max_valError && !this.timeStepError) {
                let acousticFilter = {
                    soundindex: this.soundindex,
                    max_val: this.max_val,
                    timeStep: this.timeStep
                }
                this.$emit("acousticFilterChanged", acousticFilter)
            }
            return
        }
    }
})

</script>
