<template>
    <Parameters v-model="aci" :header="aciHeader" :labels="aciLabels" :errors="aciErrors" />
</template>

<script>
import { defineComponent } from 'vue'

import Parameters from './Parameters.vue'

const aciHeader = "ACI Specifications"
const aciParams = {
    minFreq: 0,
    maxFreq: 1,
    j: 5,
    fftw: 512
}
const aciLabels = {
    minFreq: "minFreq",
    maxFreq: "maxFreq",
    j: "j",
    fftw: "fftW"
}
const aciErrors = {
    minFreq: "",
    maxFreq: "",
    j: "",
    fftw: ""
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
            aciHeader: aciHeader,
            aciLabels: aciLabels,
            aciErrors: aciErrors,
        }
    },
    computed: {
        aci: {
            get() {
                return this.modelValue
            },
            set(aci) {
                this.$emit('update:modelValue', aci)
            }
        }
    },
    watch: {
        // Errors
        aci: {
            handler() {
                let {minFreq, maxFreq, j, fftw} = this.aci
                if (isNaN(minFreq)) {
                    this.aciErrors.minFreq = "Must be a number"
                } else if (minFreq < 0) {
                    this.aciErrors.minFreq = "Must be greater than 0"
                } else if (minFreq >= maxFreq) {
                    this.aciErrors.minFreq = "Must be less than maxFreq"
                } else {
                    this.aciErrors.minFreq = ""
                }

                if (isNaN(maxFreq)) {
                    this.aciErrors.maxFreq = "Must be a number"
                } else if (minFreq >= maxFreq) {
                    this.aciErrors.maxFreq = "Must be more than minFreq"
                } else {
                    this.aciErrors.maxFreq = ""
                }

                if(isNaN(j)) {
                    this.aciErrors.j = "Must be a number"
                } else if (j < 1) {
                    this.aciErrors.j = "Must be greater than or equal to 1"
                } else {
                    this.aciErrors.j = ""
                }

                if (isNaN(fftw)) {
                    this.aciErrors.fftw = "Must be a number"
                } else if (fftw < 1) {
                    this.aciErrors.fftw = "Must be greater than or equal to 1"
                } else {
                    this.aciErrors.fftw = ""
                }
            },
            deep: true
        },
    },
    beforeMount() {
        // Set defaults
        this.aci = {...aciParams}
    },
})
</script>
