<template>
    <div class="w-full">
        <div class="flex flex-col h-full dark:text-black">
            <InputLabel class="text-2xl mb-[10px]">
                BIO Specifications
            </InputLabel>
            <InputLabel class="mt-[10px]">
                minFreq
            </InputLabel>
            <InputLabel v-if="minError" class="text-red-500">
                {{ errorMessages.minFreq }}
            </InputLabel>
            <TextInput v-model="minFreq" :value="minFreq" v-on:blur="validateFreq()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                maxFreq
            </InputLabel>
            <InputLabel v-if="maxError" class="text-red-500">
                {{ errorMessages.maxFreq }}
            </InputLabel>
            <TextInput v-model="maxFreq" :value="maxFreq" v-on:blur="validateFreq()">

            </TextInput>
            <InputLabel class="mt-[10px]">
                fftW
            </InputLabel>
            <InputLabel v-if="fftwError" class="text-red-500">
                {{ errorMessages.fftw }}
            </InputLabel>
            <TextInput v-model="fftW" :value="fftW" v-on:blur="validateFftw()">

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
    minFreq: 2000,
    maxFreq: 8000,
    fftW: 512,
};
const errorMessages = {
    minFreq: "minFreq must be an integer greater than 0 and less than maxFreq",
    maxFreq: "maxFreq must be an integer greater than 0 and greater than minFreq",
    j: "j must be an integer greater than or equal to 1",
    fftw: "fftW must be an integer greater than or equal to 1"
}
let minFreq = specificationDefaults.minFreq
let maxFreq = specificationDefaults.maxFreq
let fftW = specificationDefaults.fftW
let minError = false
let maxError = false
let fftwError = false

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
            minFreq,
            maxFreq,
            fftW,
            fftwError,
            minError,
            maxError,
            errorMessages
        }
    },
    methods: {
        onRestoreDefault: function (event) {
            this.minFreq = specificationDefaults.minFreq;
            this.maxFreq = specificationDefaults.maxFreq;
            this.fftW = specificationDefaults.fftW;
            this.minError = false
            this.maxError = false
            this.fftwError = false
            this.onChange()
            return
        },
        validateFreq: function () {
            if (isNaN(this.minFreq)) {
                this.minError = true
                return
            } else if (this.minFreq < 0 || this.minFreq >= this.maxFreq) {
                this.minError = true
                return
            }
            if (isNaN(this.maxFreq)) {
                this.maxError = true
                return
            } else if (this.maxFreq <= this.minFreq) {
                this.maxError = true
                return
            }
            this.maxError = false;
            this.minError = false;
            this.onChange()
            return
        },
        validateFftw: function () {
            if (isNaN(this.fftW)) {
                this.fftwError = true
                return
            } else if (this.fftW < 1) {
                this.fftwError = true
                return
            }
            this.fftwError = false;
            this.onChange()
            return
        },
        onChange: function () {
            if (!this.minError && !this.maxError && !this.fftwError) {
                let bi = {
                    fftw: this.fftW,
                    max_freq: this.maxFreq,
                    min_freq: this.minFreq
                }
                this.$emit('biChanged', bi)
            }
            return
        }
    }
})

</script>
