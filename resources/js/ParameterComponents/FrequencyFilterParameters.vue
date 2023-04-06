<template>
    <Parameters v-model="frequencyFilter" :header="frequencyFilterHeader" :labels="frequencyFilterLabels" :errors="frequencyFilterErrors" />
</template>

<script>
import { defineComponent } from 'vue'

import Parameters from './Parameters.vue'

const frequencyFilterHeader = "Frequency Filter Specifications"
const frequencyFilterParams = {
    minFreq: 0,
    maxFreq: 10000
}
const frequencyFilterLabels = {
    minFreq: "minFreq",
    maxFreq: "maxFreq",
}
const frequencyFilterErrors = {
    minFreq: "",
    maxFreq: "",
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
            frequencyFilterHeader: frequencyFilterHeader,
            frequencyFilterLabels: frequencyFilterLabels,
            frequencyFilterErrors: frequencyFilterErrors,
        }
    },
    computed: {
        frequencyFilter: {
            get() {
                return this.modelValue
            },
            set(frequencyFilter) {
                this.$emit('update:modelValue', frequencyFilter)
            }
        }
    },
    watch: {
        // Errors
        frequencyFilter: {
            handler() {
                let {minFreq, maxFreq} = this.frequencyFilter
                if (isNaN(minFreq)) {
                    this.frequencyFilterErrors.minFreq = "Must be a number"
                } else if (minFreq < 0) {
                    this.frequencyFilterErrors.minFreq = "Must be greater than 0"
                } else if (minFreq >= maxFreq) {
                    this.frequencyFilterErrors.minFreq = "Must be less than maxFreq"
                } else {
                    this.frequencyFilterErrors.minFreq = ""
                }

                if (isNaN(maxFreq)) {
                    this.frequencyFilterErrors.maxFreq = "Must be a number"
                } else if (minFreq >= maxFreq) {
                    this.frequencyFilterErrors.maxFreq = "Must be more than minFreq"
                } else {
                    this.frequencyFilterErrors.maxFreq = ""
                }
            },
            deep: true
        },
    },
    beforeMount() {
        // Set defaults
        this.frequencyFilter = {...frequencyFilterParams}
    },
})
</script>
