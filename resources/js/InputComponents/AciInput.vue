<template>
    <div class="w-full">
        <div class="flex flex-col h-full dark:text-black">
            <InputLabel class="text-2xl mb-[10px]">
                ACI Specifications
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
                j
            </InputLabel>
            <InputLabel v-if="jError" class="text-red-500">
                {{ errorMessages.j }}
            </InputLabel>
            <TextInput v-model="j" :value="j" v-on:blur="validatej()">

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
    minFreq: 0,
    maxFreq: 1,
    j: 5,
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
let j = specificationDefaults.j
let fftW = specificationDefaults.fftW
let errorText = ''
let minError = false;
let maxError = false;
let jError = false;
let fftwError = false;

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
            j,
            fftW,
            errorMessages,
            minError,
            maxError,
            jError,
            fftwError
        }
    },
    methods: {
        onRestoreDefault: function (event) {
            this.minFreq = specificationDefaults.minFreq;
            this.maxFreq = specificationDefaults.maxFreq;
            this.j = specificationDefaults.j;
            this.fftW = specificationDefaults.fftW;
            return
        },
        validateFreq: function () {
            if (isNaN(minFreq)) {
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
            return
        },
        validatej: function () {
            if (isNaN(this.j)) {
                this.jError = true
                return
            } else if (this.j < 1) {
                this.jError = true
                return
            }
            this.jError = false;
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
            return
        }
    }
})

</script>
