<template>
    <ResultOptions :options="multiFileOptions" v-model="selections"/>
</template>

<script>
// TODO alert user when the two files (results) dont have any indices in common
import {defineComponent} from "vue";

import ResultOptions from "@/ResultOptionsComponents/ResultOptions.vue";

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
                file_one: {
                    label: "File",
                    options: this.fileOptions,
                    labelKey: "file.name",
                },
                file_two: {
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
                : [];
        },
        fileOptions() {
            return this.selections.series != null
                ? this.selections.series.results // we are choosing the results, but displaying the file name
                : [];
        },
        indexOptions() {
            return (this.selections.file_one != null && this.selections.file_two != null)
                ? this.findIndicesUsed(this.selections.file_one, this.selections.file_two) // file is really the results
                : [];
        },
        chartOptions() {
            return this.selections.index != null
                ? this.getChartOptions(this.selections.index)
                : [];
        }
    },
    watch: {
        'selections.index'(newIndex) {
            if (newIndex == "NDSI" || newIndex == "RMS") {
                this.selections.chart = "Compare Bar"
            }
        }
    },
    methods: {
        findIndicesUsed(result_one, result_two) {
            let indicesUsedOne = [];
            let indicesUsedTwo = [];

            Object.keys(result_one).forEach((key) => {
                ["aci", "adi", "aei", "bi", "ndsi", "rms"].forEach((index) => {
                    if (
                        key.includes(index) &&
                        result_one[key] != null
                    ) {
                        indicesUsedOne.push(index.toUpperCase());
                    }
                })
            });
            Object.keys(result_two).forEach((key) => {
                ["aci", "adi", "aei", "bi", "ndsi", "rms"].forEach((index) => {
                    if (
                        key.includes(index) &&
                        result_two[key] != null
                    ) {
                        indicesUsedTwo.push(index.toUpperCase());
                    }
                })
            });

            // Only return what is in both
            return indicesUsedOne.filter(index => indicesUsedTwo.includes(index));
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
                    "Frequency Over Time",
                ]

            // BI can also choose Frequency Over Time graph
            if (index == "BI") {
                retval.push("Frequency Over Time");
            }

            return retval;
        },

    }
})

</script>
