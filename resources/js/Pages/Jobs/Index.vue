<template>
    <app-layout title="Queue">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Queue
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <div
                        class="bg-white border-b border-gray-200 flex flex-col"
                    >
                        <div
                            class="p-6 border-t border-gray-200 md:border-t-0 md:border-l col-span-4"
                        >
                            <div class="flex flex-col">
                                <div
                                    class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
                                >
                                    <div
                                        class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
                                    >
                                        <div
                                            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                                        >
                                            <table
                                                class="min-w-full divide-y divide-gray-200"
                                            >
                                                <thead class="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Job Name
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Indices Used
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody
                                                    class="bg-white divide-y divide-gray-200"
                                                >
                                                    <tr
                                                        v-for="item in items"
                                                        :key="item"
                                                    >
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap"
                                                        >
                                                            <div
                                                                class="flex items-start"
                                                            >
                                                                <div class="">
                                                                    <div
                                                                        class="text-sm text-gray-500"
                                                                    >
                                                                        {{
                                                                            item.name
                                                                        }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap"
                                                        >
                                                            <div
                                                                class="text-sm text-gray-900"
                                                            >
                                                                {{item.indicesUsed.join(", ")}}
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap"
                                                        >
                                                            <div class="flex justify-end">
                                                                <jet-button v-on:click="jobClicked(item)">See Results</jet-button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
import { defineComponent } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import JetButton from "@/Jetstream/Button.vue";
import { usePage } from '@inertiajs/inertia-vue3'


export default defineComponent({
    components: {
        AppLayout,
        JetButton,
    },
    data() {
        return {
            items: []
        };
    },
    mounted() {
        const findIndicesUsed = (object) => {
            let indicesUsed = []
            Object.keys(object).map(key => {
                if (key.includes('aci') && object[key] != null && !indicesUsed.includes('ACI')) {
                    indicesUsed.push('ACI')
                }
                if (key.includes('adi') && object[key] != null && !indicesUsed.includes('ADI')) {
                    indicesUsed.push('ADI')
                }
                if (key.includes('aei') && object[key] != null && !indicesUsed.includes('AEI')) {
                    indicesUsed.push('AEI')
                }
                if (key.includes('bi') && object[key] != null && !indicesUsed.includes('BIO')) {
                    indicesUsed.push('BIO')
                }
                if (key.includes('ndsi') && object[key] != null && !indicesUsed.includes('NDSI')) {
                    indicesUsed.push('NDSI')
                }
                if (key.includes('rms') && object[key] != null && !indicesUsed.includes('RMS')) {
                    indicesUsed.push('RMS')
                }
            })
            return indicesUsed
        };

        this.items = usePage().props.value.jobs
        this.items.forEach((element, ind) => this.items[ind]['indicesUsed'] = findIndicesUsed(element));
    },
    methods: {
        jobClicked: function (item) {
            window.location.replace(route('jobs.show', item.id))
        }
    }
});
</script>
