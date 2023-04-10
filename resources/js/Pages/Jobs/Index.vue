<template>
    <AppLayout title="Queue">
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
                                        <!-- Job Queue -->
                                        <DataTable :columns="jobQueueColumns" :entries="reversedItems" sortable @activeEntry="onJobEntryClicked">
                                            <template #indicesUsed="{ indicesUsed }">
                                                <div class="text-sm text-gray-900">
                                                    {{ indicesUsed.join(", ") }}
                                                </div>
                                            </template>
                                            <template #created_at="{ created_at }">
                                                <div class="text-sm text-gray-900">
                                                    {{ created_at.substring(0, 10) }}
                                                </div>
                                            </template>
                                            <template #status="{ status }">
                                                <div
                                                    class="text-sm text-gray-900"
                                                >
                                                    <button v-if="status == 0" class="bg-yellow-500 text-white font-bold py-2 px-4 rounded cursor-default shadow-lg w-28" >
                                                        {{ prob(status) }}
                                                    </button>
                                                    <button v-else-if="status == 1" class="pl-[10px] flex flex-row bg-blue-500 text-white font-bold py-2 rounded cursor-default shadow-lg w-28">
                                                        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        {{ prob(status) }}
                                                    </button>
                                                    <button v-else-if="status == 2" class="bg-green-500 text-white font-bold py-2 px-4 rounded cursor-default shadow-lg w-28" >
                                                        {{ prob(status) }}
                                                    </button>
                                                    <button v-else-if="status == 3" class="bg-red-500 text-white font-bold py-2 px-4 rounded cursor-default shadow-lg w-28">
                                                        {{ prob(status) }}
                                                    </button>
                                                    <button v-else-if="status == 3" class="bg-red-500 text-white font-bold py-2 px-4 rounded cursor-default shadow-lg w-28">
                                                        {{ prob(status)}}
                                                    </button>
                                                    <button v-else class="bg-red-500 text-white font-bold py-2 px-4 rounded cursor-default shadow-lg w-28">
                                                        "Unknown Status"
                                                    </button>
                                                </div>
                                            </template>
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script>
import {defineComponent} from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import {usePage} from "@inertiajs/vue3";
import DataTable from "@/Components/DataTable.vue";

const jobQueueColumns = [
    {
        id: "name",
        name: "Job Name",
    },
    {
        id: "indicesUsed",
        name: "Indices Used",
    },
    {
        id: "created_at",
        name: "Created On",
    },
    {
        id: "status",
        name: "Status",
    },
]

export default defineComponent({
    components: {
        AppLayout,
        PrimaryButton,
        DataTable,
    },
    data() {
        return {
            items: [],
            timer: null,
            interval: 1000,

            jobQueueColumns: jobQueueColumns,
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
                ["aci", "adi", "aei", "bi", "ndsi", "rms", "frequency_filter", "acoustic_filter"].forEach((index) => {
                    if (
                        key.includes(index) &&
                        object[key] != null &&
                        !indicesUsed.includes(index.toUpperCase())
                    ) {
                        indicesUsed.push(index.toUpperCase());
                    }
                })
            });
            return {indices: indicesUsed};
        };

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
        onJobEntryClicked(entry) {
            // Job is successful
            if (entry.status === 2) {
                // TODO Redirect to job results with this job filled in
            }
        },
    },

    beforeUnmount() {
        clearInterval(this.timer);
    }

});
</script>
