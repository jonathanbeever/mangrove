<template>
    <Parameters v-model="bi" :header="biHeader" :labels="biLabels" :errors="biErrors" />
</template>

<script>
import { defineComponent } from 'vue'

import Parameters from './Parameters.vue'

const biHeader = "BIO Specifications"
const biParams = {
    minFreq: 2000,
    maxFreq: 8000,
    fftw: 512,
}
const biLabels = {
    minFreq: "minFreq",
    maxFreq: "maxFreq",
    fftw: "fftW"
}
const biErrors = {
    minFreq: "",
    maxFreq: "",
    fftW: ""
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
            biHeader: biHeader,
            biLabels: biLabels,
            biErrors: biErrors,
        }
    },
    computed: {
        bi: {
            get() {
                return this.modelValue
            },
            set(bi) {
                this.$emit('update:modelValue', bi)
            }
        }
    },
    watch: {
        // Errors
        bio: {
            handler() {
                let {minFreq, maxFreq, j, fftW} = this.bio
                if (isNaN(minFreq) || minFreq == "") {
                    this.bioErrors.minFreq = "Must be a number"
                } else if (minFreq < 0) {
                    this.bioErrors.minFreq = "Must be greater than 0"
                } else if (minFreq >= maxFreq) {
                    this.bioErrors.minFreq = "Must be less than maxFreq"
                } else {
                    this.bioErrors.minFreq = ""
                }

                if (isNaN(maxFreq) || maxFreq == "") {
                    this.bioErrors.maxFreq = "Must be a number"
                } else if (minFreq >= maxFreq) {
                    this.bioErrors.maxFreq = "Must be more than minFreq"
                } else {
                    this.bioErrors.maxFreq = ""
                }

                if(isNaN(j)) {
                    this.bioErrors.j = "Must be a number"
                } else if (j < 1) {
                    this.bioErrors.j = "Must be greater than or equal to 1"
                } else {
                    this.bioErrors.j = ""
                }

                if (isNaN(fftW)) {
                    this.bioErrors.fftW = "Must be a number"
                } else if (fftW < 1) {
                    this.bioErrors.fftW = "Must be greater than or equal to 1"
                } else {
                    this.bioErrors.fftW = ""
                }
            },
            deep: true
        },
    },
    beforeMount() {
        // Set defaults
        this.bi = {...biParams}
    },
})
</script>
