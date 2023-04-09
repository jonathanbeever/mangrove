<template>
    <ResultOptions :options="allSeriesOptions" v-model="selections"/>
</template>

<script>
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
        allSeriesOptions() {
            return {
                site: {
                    label: "Site",
                    options: this.sites,
                    labelKey: "name"
                },
                index: {
                    label: "Index",
                    options: this.indexOptions,
                    labelKey: null,
                },

            }
        },
        indexOptions() {
            return this.selections.site != null
                ? this.findIndicesUsed(this.selections.site) // file is really the results
                : [];
        },
    },
    methods: {
        findIndicesUsed(site) {
            let indicesUsed = [];

            // Check each result in each series in the site
            site.series.forEach((s) => s.results.forEach((result) => {
                Object.keys(result).forEach((key) => {
                    ["aci", "adi", "aei", "bi", "ndsi", "rms"].forEach((index) => {
                        if (
                            key.includes(index) &&
                            result[key] != null &&
                            indicesUsed.indexOf(index.toUpperCase()) === -1
                        ) {
                            indicesUsed.push(index.toUpperCase())
                        }
                    })
                });
            }))

            return indicesUsed;
        },
    }
})

</script>
