<template>
    <ResultOptions :options="multiSeriesOptions" v-model="selections"/>
</template>

<script>
// TODO alert user when the two files (results) dont have any indices in common
import {defineComponent} from "vue";

import ResultOptions from "@/ResultOptionsComponents/ResultOptions.vue"

export default defineComponent({
    components: {
        ResultOptions
    },
    props: {
        sites: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: Object,
            required: true,
        }
    },
    computed: {
        selections: {
            get() {
                return this.modelValue
            },
            set(selections) {
                this.$emit('update:modelValue', selections)
            }
        },
        multiSeriesOptions() {
            return {
                siteOne: {
                    label: "Site One",
                    options: this.sites,
                    labelKey: "name"
                },
                seriesOne: {
                    label: "Series One",
                    options: this.seriesOptionsOne,
                    labelKey: "name"
                },
                siteTwo: {
                    label: "Site Two",
                    options: this.sites,
                    labelKey: "name"
                },
                seriesTwo: {
                    label: "Series Two",
                    options: this.seriesOptionsTwo,
                    labelKey: "name"
                },
                index: {
                    label: "Index",
                    options: this.indexOptions,
                    labelKey: null,
                },
            }
        },
        seriesOptionsOne() {
            return this.selections.siteOne != null
                ? this.selections.siteOne.series
                : []
        },
        seriesOptionsTwo() {
            return this.selections.siteTwo != null
                ? this.selections.siteTwo.series
                : []
        },
        indexOptions() {
            return (this.selections.seriesOne != null && this.selections.seriesTwo != null)
                ? this.findIndicesUsed(this.selections.seriesOne.results[0], this.selections.seriesTwo.results[0])
                : []
        },
    },
    methods: {
        findIndicesUsed(result_one, result_two) {
            let indicesUsedOne = []
            let indicesUsedTwo = []


            Object.keys(result_one).forEach((key) => {
                ["aci", "adi", "aei", "bi", "ndsi", "rms"].forEach((index) => {
                    if (
                        key.includes(index) &&
                        result_one[key] != null
                    ) {
                        indicesUsedOne.push(index.toUpperCase())
                    }
                })
            });
            Object.keys(result_two).forEach((key) => {
                ["aci", "adi", "aei", "bi", "ndsi", "rms"].forEach((index) => {
                    if (
                        key.includes(index) &&
                        result_two[key] != null
                    ) {
                        indicesUsedTwo.push(index.toUpperCase())
                    }
                })
            });

            // Only return what is in both
            return indicesUsedOne.filter(index => indicesUsedTwo.includes(index))
        },
    }
})

</script>
