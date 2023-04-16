<template>
    <Parameters v-model="acousticFilter" :header="acousticFilterHeader" :labels="acousticFilterLabels" :errors="acousticFilterErrors" :not-numbers="acousticFilterNotNumbers"/>
</template>

<script>
import { defineComponent } from 'vue'

import Parameters from './Parameters.vue'

const acousticFilterHeader = "Acoustic Filter Specifications"
const acousticFilterParams = {
    soundindex: 'ADI',
    max_val: 10,
    timeStep: 3
}
const acousticFilterLabels = {
    soundindex: "Acoustic Index ('NDSI','ACI','ADI','AEI','BI')",
    max_val: "max_val",
    timeStep: "timeStep"
}
const acousticFilterErrors = {
    soundindex: "",
    max_val: "",
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
                let {soundindex, max_val, timeStep} = this.acousticFilter

                if (!['NDSI','ACI','ADI','AEI','BI'].includes(soundindex)) {
                    this.acousticFilterErrors.soundindex = "Must be one of: NDSI, ACI, ADI, AEI, or BI"
                } else {
                    this.acousticFilterErrors.soundindex = ""
                }

                if (isNaN(max_val)) {
                    this.acousticFilterErrors.max_val = "Must be a number"
                } else if (max_val < 0) {
                    this.acousticFilterErrors.max_val = "Must be greater than or equal to 0"
                } else {
                    this.acousticFilterErrors.max_val = ""
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
