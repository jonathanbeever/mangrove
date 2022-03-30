<template>
    <div class="w-full">
        <div class="flex flex-col h-full dark:text-black">
            <jet-label class="text-2xl mb-[10px]">
                ACI Specifications
            </jet-label>
            <jet-label class="mt-[10px]">
                minFreq
            </jet-label>
            <jet-label v-if="minError" class="text-red-500">
                {{errorMessages.minFreq}}
            </jet-label>
            <jet-input v-on:blur="validateFreq()" :value="minFreq" v-model="minFreq">

            </jet-input>
            <jet-label class="mt-[10px]">
                maxFreq
            </jet-label>
            <jet-label v-if="maxError" class="text-red-500">
                {{errorMessages.maxFreq}}
            </jet-label>
            <jet-input v-on:blur="validateFreq()" :value="maxFreq" v-model="maxFreq">

            </jet-input>
            <jet-label class="mt-[10px]">
                j
            </jet-label>
            <jet-label v-if="jError" class="text-red-500">
                {{errorMessages.j}}
            </jet-label>
            <jet-input v-on:blur="validatej()" :value="j" v-model="j">

            </jet-input>
            <jet-label class="mt-[10px]">
                fftW
            </jet-label>
            <jet-label v-if="fftwError" class="text-red-500">
                {{errorMessages.fftw}}
            </jet-label>
            <jet-input v-on:blur="validateFftw()" :value="fftW" v-model="fftW">

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
            JetApplicationLogo,
            JetButton,
            JetLabel,
            JetInput
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
    } )

</script>
