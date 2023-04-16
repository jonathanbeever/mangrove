<template>
    <ResultOptions :options="multiFileOptions" v-model="selections"/>
</template>

<script>
// TODO alert user when the two files (results) dont have any indices in common
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
        multiFileOptions() {
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
                fileOne: {
                    label: "File One",
                    options: this.fileOptions,
                    labelKey: "file.name",
                },
                fileTwo: {
                    label: "File Two",
                    options: this.fileOptions,
                    labelKey: "file.name",
                },
                index: {
                    label: "Index",
                    options: this.indexOptions,
                    labelKey: null,
                },
                chart: {
                    label: "Chart",
                    options: this.chartOptions,
                    labelKey: null,
                }
            }
        },
        seriesOptions() {
            return this.selections.site != null
                ? this.selections.site.series
                : []
        },
        fileOptions() {
            return this.selections.series != null
                ? this.selections.series.results // we are choosing the results, but displaying the file name
                : []
        },
        indexOptions() {
            return (this.selections.fileOne != null && this.selections.fileTwo != null)
                ? this.findIndicesUsed(this.selections.fileOne, this.selections.fileTwo) // file is really the results
                : []
        },
        chartOptions() {
            return this.selections.index != null
                ? this.getChartOptions(this.selections.index)
                : []
        }
    },
    watch: {
        'selections.site'(newSite) {
            if (newSite) {
                this.selections.series = null;
                this.selections.fileOne = null;
                this.selections.fileTwo = null;
                this.selections.index = null;
                this.selections.chart = null;
            }
        },
        'selections.series'(newSeries) {
            if (newSeries) {
                this.selections.fileOne = null;
                this.selections.fileTwo = null;
                this.selections.index = null;
                this.selections.chart = null;
            }
        },
        'selections.fileOne'(newFileOne) {
            if (newFileOne) {
                this.selections.fileTwo = null;
                this.selections.index = null;
                this.selections.chart = null;
            }
        },
        'selections.fileTwo'(newFileTwo) {
            if (newFileTwo) {
                this.selections.index = null;
                this.selections.chart = null;
            }
        },
        'selections.index'(newIndex) {
            if (newIndex) {
                if (newIndex == "NDSI" || newIndex == "RMS") {
                    this.$nextTick(() => {
                        this.selections.chart = "Single Bar"
                    });
                }
                else {
                    // I believe nextTick is necessary because the SingleFileVisualizations was trying to
                    // generate the next chart before the selections were actually nulled
                    this.$nextTick(() => {
                        this.selections.chart = null;
                    });
                }
            }
            // if (newIndex == "NDSI" || newIndex == "RMS") {
            //     this.selections.chart = "Compare Bar"
            // }
        }
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
            })
            Object.keys(result_two).forEach((key) => {
                ["aci", "adi", "aei", "bi", "ndsi", "rms"].forEach((index) => {
                    if (
                        key.includes(index) &&
                        result_two[key] != null
                    ) {
                        indicesUsedTwo.push(index.toUpperCase())
                    }
                })
            })

            // Only return what is in both
            return indicesUsedOne.filter(index => indicesUsedTwo.includes(index))
        },
        getChartOptions(index) {
            // NDSI and RMS have no choice
            if (index == "NDSI" || index == "RMS") {
                return []
            }

            return [
                "Dual Line",
                "Compare Bar"
            ]
        },
    }
})

</script>
