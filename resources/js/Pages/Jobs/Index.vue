<template>
    <app-layout title="Queue">
        <template #header>
            <h2
                class="font-semibold text-xl text-gray-800 leading-tight dark:text-white pl-8"
            >
                Queue
            </h2>
        </template>
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="mt-12 bg-white overflow-hidden shadow-inner shadow-sky-200 dark:shadow-cyan-500 sm:rounded-lg dark:bg-slate-900">
            <div class="p-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <div class="flex flex-col">
                        <div class="-my-2 sm:-mx-6 lg:-mx-8">
                            <div
                                class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
                            >
                                <div
                                    class="shadow overflow-y-auto overflow-x-hidden max-h-96 border-b border-gray-200 sm:rounded-lg"
                                >
                                    <table
                                        class="min-w-full divide-y divide-gray-200"
                                    >
                                        <thead class="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th
                                                class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                Job Name
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                Indices Used
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                Created On
                                            </th>
                                            <th
                                                class="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                Status
                                            </th>

                                        </tr>
                                        </thead>
                                        <tbody
                                            class="bg-white divide-y divide-gray-200"
                                        >
                                        <tr
                                            v-for="item in reversedItems"
                                            :key="item"
                                        >
                                            <td
                                                class="px-6 py-4 whitespace-nowrap"
                                            >
                                                <div
                                                    class="text-sm text-gray-500"
                                                >
                                                    {{ item.name }}
                                                </div>
                                            </td>
                                            <td
                                                class="px-6 py-4 whitespace-nowrap"
                                            >
                                                <div
                                                    class="text-sm text-gray-900"
                                                >
                                                    {{
                                                        item.indicesUsed.join(
                                                            ", "
                                                        )
                                                    }}
                                                </div>
                                            </td>
                                            <td
                                                class="px-6 py-4 whitespace-nowrap"
                                            >
                                                <div
                                                    class="text-sm text-gray-900"
                                                >
                                                    {{
                                                        item.created_at.substring(
                                                            0,
                                                            10
                                                        )
                                                    }}
                                                </div>
                                            </td>
                                            <td
                                                class="px-6 py-4 whitespace-nowrap text-right"
                                            >
                                                <div
                                                    class="text-sm text-gray-900"
                                                >

                                                    <button class="bg-yellow-500 text-white font-bold py-2 px-4 rounded cursor-default shadow-lg w-28" v-if="item.status == 0">
                                                    {{prob(item.status)}}
                                                    </button>

                                                    <button class="pl-[10px] flex flex-row float-right bg-blue-500 text-white font-bold py-2 rounded cursor-default shadow-lg w-28" v-if="item.status == 1">
                                                        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    {{prob(item.status)}}
                                                    </button>
                                                    <button class="bg-green-500 text-white font-bold py-2 px-4 rounded cursor-default shadow-lg w-28" v-if="item.status == 2">
                                                    {{prob(item.status)}}
                                                    </button>
                                                    <button class="bg-red-500 text-white font-bold py-2 px-4 rounded cursor-default shadow-lg w-28" v-if="item.status == 3">
                                                    {{prob(item.status)}}
                                                    </button>
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
    </app-layout>
</template>

<script>
import {defineComponent} from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import {usePage} from "@inertiajs/vue3";

export default defineComponent({
    components: {
        AppLayout,
        PrimaryButton,

    },

    data() {
        return {
            items: [],
            timer: null,
            interval: 1000,
        };
    },

    computed: {
        reversedItems() {
            return this.items.reverse();
        },
        currentStatuses() {
            return this.items.reduce((statuses, item) => {
                statuses[item.id] = item.status;
                return statuses;
            }, {});
        },
    },

    mounted() {

        this.items = usePage().props.jobs;
        this.timer = setInterval(this.fetchJobStatuses, 1000);

        const findIndicesUsed = (object) => {
            let indicesUsed = [];
            Object.keys(object).map((key) => {
                if (
                    key.includes("aci") &&
                    object[key] != null &&
                    !indicesUsed.includes("ACI")
                ) {
                    indicesUsed.push("ACI");
                }
                if (
                    key.includes("adi") &&
                    object[key] != null &&
                    !indicesUsed.includes("ADI")
                ) {
                    indicesUsed.push("ADI");
                }
                if (
                    key.includes("aei") &&
                    object[key] != null &&
                    !indicesUsed.includes("AEI")
                ) {
                    indicesUsed.push("AEI");
                }
                if (
                    key.includes("bi") &&
                    object[key] != null &&
                    !indicesUsed.includes("BIO")
                ) {
                    indicesUsed.push("BIO");
                }
                if (
                    key.includes("ndsi") &&
                    object[key] != null &&
                    !indicesUsed.includes("NDSI")
                ) {
                    indicesUsed.push("NDSI");
                }
                if (
                    key.includes("rms") &&
                    object[key] != null &&
                    !indicesUsed.includes("RMS")
                ) {
                    indicesUsed.push("RMS");
                }
                if (
                    key.includes("frequencyFilter") &&
                    object[key] != null &&
                    !indicesUsed.includes("FREQUENCYFILTER")
                ) {
                    indicesUsed.push("FREQUENCYFILTER");
                }
                if (
                    key.includes("acousticFilter") &&
                    object[key] != null &&
                    !indicesUsed.includes("ACOUSTICFILTER")
                ) {
                    indicesUsed.push("ACOUSTICFILTER");
                }
            });
            return {indices: indicesUsed};
        };

        // this.items = usePage().props.jobs;
        this.items.forEach((element, ind) => {
            let result = findIndicesUsed(element);
            this.items[ind]["indicesUsed"] = result.indices;
            if (element.series.results.length == 0) {
                this.items[ind]["finished"] = false
            } else {
                this.items[ind]["finished"] = true
            }
        });
    },
    methods: {

        prob: function(e) {
            switch(e)
            {
                case 0: return "Queued";
                case 1: return "Running";
                case 2: return "Succeeded";
                case 3: return "Failed";
                default: return "";
            }
        },

        async fetchJobStatuses() {
            try {
                const response = await axios.get('/jobs/statuses', { params: { currentStatuses: this.currentStatuses } });
                const statuses = response.data.statuses;
                const statusArray = Object.entries(statuses).map(([id, status]) => ({id: parseInt(id), status}));

                // console.log(statusArray);
                statusArray.forEach(statusObj => {
                    const index = this.items.findIndex(item => item.id === statusObj.id);
                    if (index !== -1 && this.items[index].status !== statusObj.status) {
                        this.items[index].status = statusObj.status;
                        this.currentStatuses[statusObj.id] = statusObj.status;
                    }
                });
            } catch (error) {
                console.error('Error fetching job statuses:', error);
            }
        },
    },

    beforeUnmount() {
        clearInterval(this.timer);
    }

});
</script>
