<template>
    <ResultOptions :options="singleSeriesOptions" v-model="selections"/>
</template>

<script>
import {defineComponent} from "vue"

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
        singleSeriesOptions() {
            return {
                site: {
                    label: "Site",
                    options: this.sites,
                    labelKey: "name"
                },
                series: {
                    label: "Series",
                    options: this.seriesOptions,
                    labelKey: "name"
                },
                index: {
                    label: "Index",
                    options: this.indexOptions,
                    labelKey: null,
                }
            }
        },
        seriesOptions() {
            return this.selections.site != null
                ? this.selections.site.series
                : []
        },
        indexOptions() {
            return this.selections.series != null
                ? this.findIndicesUsed(this.selections.series.results[0])
                : []
        },
    },
    watch: {
        'selections.site'(newSite) {
            if (newSite) {
                this.selections.series = null;
                this.selections.index = null;
            }
        },
        'selections.series'(newSeries) {
            if (newSeries) {
                this.selections.index = null;
            }
        },
    },
    methods: {
        findIndicesUsed(result) {
            let indicesUsed = []
            Object.keys(result).forEach((key) => {
                ["aci", "adi", "aei", "bi", "ndsi", "rms"].forEach((index) => {
                    if (
                        key.includes(index) &&
                        result[key] != null
                    ) {
                        indicesUsed.push(index.toUpperCase())
                    }
                })
            })
            return indicesUsed
        }
    }
})

</script>
