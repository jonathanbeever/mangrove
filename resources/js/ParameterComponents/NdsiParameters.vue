<template>
    <Parameters v-model="ndsi" :header="ndsiHeader" :labels="ndsiLabels" :errors="ndsiErrors" />
</template>

<script>
import { defineComponent } from 'vue'

import Parameters from './Parameters.vue'

const ndsiHeader = "NDSI Specifications"
const ndsiParams = {
    anthroMin: 1000,
    anthroMax: 2000,
    bioMin: 2000,
    bioMax: 11000,
    fftw: 1024
}
const ndsiLabels = {
    anthroMin: "anthroMin",
    anthroMax: "anthroMax",
    bioMin: "bioMin",
    bioMax: "bioMax",
    fftw: "fftW"
}
const ndsiErrors = {
    anthroMin: "",
    anthroMax: "",
    bioMin: "",
    bioMax: "",
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
            ndsiHeader: ndsiHeader,
            ndsiLabels: ndsiLabels,
            ndsiErrors: ndsiErrors,
        }
    },
    computed: {
        ndsi: {
            get() {
                return this.modelValue
            },
            set(ndsi) {
                this.$emit('update:modelValue', ndsi)
            }
        }
    },
    watch: {
        // Errors
        ndsi: {
            handler() {
                let {anthroMin, anthroMax, bioMin, bioMax, fftw} = this.ndsi
                if (isNaN(anthroMin)) {
                    this.ndsiErrors.anthroMin = "Must be a number"
                } else if (anthroMin < 0) {
                    this.ndsiErrors.anthroMin = "Must be greater than or equal to 0"
                } else {
                    this.ndsiErrors.anthroMin = ""
                }

                if (isNaN(anthroMax)) {
                    this.ndsiErrors.anthroMax = "Must be a number"
                } else if (anthroMax < 0) {
                    this.ndsiErrors.anthroMax = "Must be greater than or equal to 0"
                } else {
                    this.ndsiErrors.anthroMax = ""
                }

                if (isNaN(bioMin)) {
                    this.ndsiErrors.bioMin = "Must be a number"
                } else if (bioMin < 0) {
                    this.ndsiErrors.bioMin = "Must be greater than or equal to 0"
                } else {
                    this.ndsiErrors.bioMin = ""
                }

                if (isNaN(bioMax)) {
                    this.ndsiErrors.bioMax = "Must be a number"
                } else if (bioMax < 0) {
                    this.ndsiErrors.bioMax = "Must be greater than or equal to 0"
                } else {
                    this.ndsiErrors.bioMax = ""
                }

                if (isNaN(fftw)) {
                    this.ndsiErrors.fftw = "Must be a number"
                } else if (fftw < 0) {
                    this.ndsiErrors.fftw = "Must be greater than or equal to 0"
                } else {
                    this.ndsiErrors.fftw = ""
                }
            },
            deep: true
        },
    },
    beforeMount() {
        // Set defaults
        this.ndsi = {...ndsiParams}
    },
})
</script>
