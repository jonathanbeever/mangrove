<template>
    <div class="w-full">
        <div class="flex flex-col h-full dark:text-black">
            <InputLabel class="text-2xl mb-[10px]">
                NDSI Specifications
            </InputLabel>
            <InputLabel class="mt-[10px]">
                anthroMin
            </InputLabel>
            <InputLabel v-if="anthroMinError" class="text-red-500">
                {{ errorMessages.anthroMin }}
            </InputLabel>
            <TextInput v-model="anthroMin" :value="anthroMin" v-on:blur="validateAnthroMin()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                anthroMax
            </InputLabel>
            <InputLabel v-if="anthroMaxError" class="text-red-500">
                {{ errorMessages.anthroMax }}
            </InputLabel>
            <TextInput v-model="anthroMax" :value="anthroMax" v-on:blur="validateAnthroMax()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                bioMin
            </InputLabel>
            <InputLabel v-if="bioMinError" class="text-red-500">
                {{ errorMessages.biomin }}
            </InputLabel>
            <TextInput v-model="bioMin" :value="bioMin" v-on:blur="validateBioMin()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                bioMax
            </InputLabel>
            <InputLabel v-if="bioMaxError" class="text-red-500">
                {{ errorMessages.bioMax }}
            </InputLabel>
            <TextInput v-model="bioMax" :value="bioMax" v-on:blur="validateBioMax()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                FFTW
            </InputLabel>
            <InputLabel v-if="fftWError" class="text-red-500">
                {{ errorMessages.fftW }}
            </InputLabel>
            <TextInput v-model="fftW" :value="fftW" v-on:blur="validatefftW()">

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
    anthroMin: 1000,
    anthroMax: 2000,
    bioMin: 2000,
    bioMax: 11000,
    fftW: 1024
};
const errorMessages = {
    anthroMin: "anthroMin must be an integer greater than 0",
    anthroMax: "anthroMax must be an integer greater than 0",
    bioMin: "bioMin must be an integer greater than 0",
    bioMax: "bioMax must be an integer greater than 0",
    fftW: "fftW must be an integer greater than 0"
}
let anthroMin = specificationDefaults.anthroMin
let anthroMax = specificationDefaults.anthroMax
let bioMin = specificationDefaults.bioMin
let bioMax = specificationDefaults.bioMax
let fftW = specificationDefaults.fftW
let anthroMinError = false
let anthroMaxError = false
let bioMinError = false
let bioMaxError = false
let fftWError = false

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
            anthroMin,
            anthroMax,
            bioMin,
            bioMax,
            fftW,
            anthroMinError,
            anthroMaxError,
            bioMinError,
            bioMaxError,
            fftWError,
            errorMessages
        }
    },
    methods: {
        onRestoreDefault: function (event) {
            this.anthroMin = specificationDefaults.anthroMin
            this.anthroMax = specificationDefaults.anthroMax
            this.bioMin = specificationDefaults.bioMin
            this.bioMax = specificationDefaults.bioMax
            this.fftW = specificationDefaults.fftW
            this.anthroMinError = false
            this.anthroMaxError = false
            this.bioMinError = false
            this.bioMaxError = false
            this.fftWError = false
            this.onChange()
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
            this.onChange()
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
            this.onChange()
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
            this.onChange()
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
            this.onChange()
            return
        },
        validatefftW: function () {
            if (isNaN(this.fftW)) {
                this.fftWError = true
                return
            } else if (this.fftW < 0) {
                this.fftWError = true
                return
            }
            this.fftWError = false;
            this.onChange()
            return
        },
        onChange: function () {
            if (!this.anthroMaxError && !this.anthroMinError
                && !this.bioMaxError && !this.bioMinError
                && !this.fftWError) {
                let ndsi = {
                    anthro_max: this.anthroMax,
                    anthro_min: this.anthroMin,
                    bio_max: this.bioMax,
                    bio_min: this.bioMin,
                    fftw: this.fftW
                }
                this.$emit('ndsiChanged', ndsi)
            }
            return
        }
    }
})

</script>
