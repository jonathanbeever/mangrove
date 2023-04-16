<template>
    <ResultOptions :options="singleFileOptions" v-model="selections"/>
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
        singleFileOptions() {
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
                file: {
                    label: "File",
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
            return this.selections.file != null
                ? this.findIndicesUsed(this.selections.file) // file is really the results
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
                this.selections.file = null;
                this.selections.index = null;
                this.selections.chart = null;
            }
        },
        'selections.series'(newSeries) {
            if (newSeries) {
                this.selections.file = null;
                this.selections.index = null;
                this.selections.chart = null;
            }
        },
        'selections.file'(newFile) {
            if (newFile) {
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
            // vv ORIGINAL CODE for selections.index vv
            // if (newIndex == "NDSI" || newIndex == "RMS") {
            //     this.selections.chart = "Single Bar"
            // }
        }
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
        },
        getChartOptions(index) {
            // NDSI and RMS have no choice
            if (index == "NDSI" || index == "RMS") {
                return []
            }

            // Default Choices
            let retval = [
                    "Single Line",
                    "Single Bar",
                    "Dual Line",
                    "Compare Bar",
                ]

            // BI can also choose Frequency Over Time graph
            if (index == "BI") {
                retval.push("Frequency Over Time")
            }

            return retval
        },
    }
})

</script>
