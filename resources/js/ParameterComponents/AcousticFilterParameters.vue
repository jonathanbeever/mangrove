<template>
    <Parameters v-model="acousticFilter" :header="acousticFilterHeader" :labels="acousticFilterLabels" :errors="acousticFilterErrors" :not-numbers="acousticFilterNotNumbers"/>
</template>

<script>
import { defineComponent } from 'vue'

import Parameters from './Parameters.vue'

const acousticFilterHeader = "Acoustic Filter Specifications"
const acousticFilterParams = {
    soundindex: 'ADI',
    maxVal: 10,
    timeStep: 3
}
const acousticFilterLabels = {
    soundindex: "Acoustic Index ('NDSI','ACI','ADI','AEI','BI')",
    maxVal: "maxVal",
    timeStep: "timeStep"
}
const acousticFilterErrors = {
    soundindex: "",
    maxVal: "",
    timeStep: ""
}
const acousticFilterNotNumbers = ['soundindex']

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
            acousticFilterHeader: acousticFilterHeader,
            acousticFilterLabels: acousticFilterLabels,
            acousticFilterErrors: acousticFilterErrors,
            acousticFilterNotNumbers: acousticFilterNotNumbers,
        }
    },
    computed: {
        acousticFilter: {
            get() {
                return this.modelValue
            },
            set(acousticFilter) {
                this.$emit('update:modelValue', acousticFilter)
            }
        }
    },
    watch: {
        // Errors
        acousticFilter: {
            handler() {
                let {soundindex, maxVal, timeStep} = this.acousticFilter

                if (!['NDSI','ACI','ADI','AEI','BI'].includes(soundindex)) {
                    this.acousticFilterErrors.soundindex = "Must be one of: NDSI, ACI, ADI, AEI, or BI"
                } else {
                    this.acousticFilterErrors.soundindex = ""
                }

                if (isNaN(maxVal)) {
                    this.acousticFilterErrors.maxVal = "Must be a number"
                } else if (maxVal < 0) {
                    this.acousticFilterErrors.maxVal = "Must be greater than or equal to 0"
                } else {
                    this.acousticFilterErrors.maxVal = ""
                }

                if (isNaN(timeStep)) {
                    this.acousticFilterErrors.timeStep = "Must be a number"
                } else if (timeStep < 2) {
                    this.acousticFilterErrors.timeStep = "Must be greater than or equal to 2"
                } else {
                    this.acousticFilterErrors.timeStep = ""
                }
            },
            deep: true
        },
    },
    beforeMount() {
        // Set defaults
        this.acousticFilter = {...acousticFilterParams}
    },
})
</script>
