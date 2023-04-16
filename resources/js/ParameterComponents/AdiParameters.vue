<template>
    <Parameters v-model="adi" :header="adiHeader" :labels="adiLabels" :errors="adiErrors" />
</template>

<script>
import { defineComponent } from 'vue'

import Parameters from './Parameters.vue'

const adiHeader = "ADI Specifications"
const adiParams = {
    maxFreq: 10000,
    dbThreshold: -50,
    freqStep: 1000,
    shannon: true
}
const adiLabels = {
    maxFreq: "maxFreq",
    dbThreshold: "dbThreshold",
    freqStep: "freqStep"
}
const adiErrors = {
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
            adiHeader: adiHeader,
            adiLabels: adiLabels,
            adiErrors: adiErrors,
        }
    },
    computed: {
        adi: {
            get() {
                return this.modelValue
            },
            set(adi) {
                this.$emit('update:modelValue', adi)
            }
        }
    },
    watch: {
        // Errors
        adi: {
            handler() {
                let {maxFreq, freqStep} = this.adi

                if(isNaN(maxFreq)) {
                    this.adiErrors.maxFreq = "Must be a number"
                } else if (maxFreq < 0) {
                    this.adiErrors.maxFreq = "Must be greater than or equal to 0"
                } else {
                    this.adiErrors.maxFreq = ""
                }

                if(isNaN(freqStep)) {
                    this.adiErrors.freqStep = "Must be a number"
                } else if (freqStep < 1) {
                    this.adiErrors.freqStep = "Must be greater than or equal to 1"
                } else {
                    this.adiErrors.freqStep = ""
                }
            },
            deep: true
        },
    },
    beforeMount() {
        // Set defaults
        this.adi = {...adiParams}
    },
})
</script>
