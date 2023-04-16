<template>
    <Parameters v-model="aei" :header="aeiHeader" :labels="aeiLabels" :errors="aeiErrors" />
</template>

<script>
import { defineComponent } from 'vue'

import Parameters from './Parameters.vue'

const aeiHeader = "AEI Specifications"
const aeiParams = {
    maxFreq: 10000,
    dbThreshold: -50,
    freqStep: 1000,
    shannon: true
}
const aeiLabels = {
    maxFreq: "maxFreq",
    dbThreshold: "dbThreshold",
    freqStep: "freqStep"
}
const aeiErrors = {
    maxFreq: "",
    dbThreshold: "",
    freqStep: ""
}

export default defineComponent({
    components: {
        Parameters,
    },
    props: {
        modelValue: {
            type: Object,
            required: true
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            aeiHeader: aeiHeader,
            aeiLabels: aeiLabels,
            aeiErrors: aeiErrors,
        }
    },
    computed: {
        aei: {
            get() {
                return this.modelValue
            },
            set(aei) {
                this.$emit('update:modelValue', aei)
            }
        }
    },
    watch: {
        // Errors
        aei: {
            handler() {
                let {maxFreq, freqStep} = this.aei

                if(isNaN(maxFreq)) {
                    this.aeiErrors.maxFreq = "Must be a number"
                } else if (maxFreq < 0) {
                    this.aeiErrors.maxFreq = "Must be greater than or equal to 0"
                } else {
                    this.aeiErrors.maxFreq = ""
                }

                if(isNaN(freqStep)) {
                    this.aeiErrors.freqStep = "Must be a number"
                } else if (freqStep < 1) {
                    this.aeiErrors.freqStep = "Must be greater than or equal to 1"
                } else {
                    this.aeiErrors.freqStep = ""
                }
            },
            deep: true
        },
    },
    beforeMount() {
        // Set defaults
        this.aei = {...aeiParams}
    },
})
</script>
