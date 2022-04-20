<template>
    <app-layout title="Create Jobs">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight dark:text-white pl-8">
                Create Jobs
            </h2>
        </template>

        <div v-if="renderJobCreation" class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-900 shadow-inner shadow-sky-200 dark:shadow-cyan-500">
                    <div
                        class="bg-white flex flex-col dark:bg-slate-900 shadow-inner shadow-sky-200 dark:shadow-cyan-500"
                    >
                        <div class="px-8 py-6">Select Series</div>
                        <div
                            class="flex flex-col"
                        >
                            <jet-input
                                v-model="search"
                                class="p-4 mx-6 align-content-center dark:text-black"
                                placeholder="Search"
                                type="text"
                                v-on:change="filtered()"
                            />
                            <div
                                class="flex flex-col p-6 overflow-hidden max-h-96 rounded"
                            >
                                <div class="overflow-y-auto rounded">
                                    <div
                                        class="align-middle inline-block min-w-full"
                                    >
                                        <div
                                            class="shadow border-b border-gray-200 sm:rounded-lg"
                                        >
                                            <table
                                                class="min-w-full divide-y divide-gray-200 rounded"
                                            >
                                                <thead class="bg-gray-50 sticky top-0 pt-2 rounded">
                                                <tr>
                                                    <th
                                                        class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                                        scope="col"
                                                    >
                                                        Series
                                                    </th>
                                                    <th
                                                        class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                                                        scope="col"
                                                    >
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody
                                                    class="bg-white divide-y divide-gray-200"
                                                >
                                                <tr
                                                    v-for="(
                                                            item, index
                                                        ) in filteredItems"
                                                    :key="index"
                                                >
                                                    <td
                                                        class="px-6 py-4 whitespace-nowrap"
                                                    >
                                                        <div
                                                            class="text-sm font-medium text-gray-900"
                                                        >
                                                            {{
                                                                item.name
                                                            }}


                                                        </div>
                                                    </td>
                                                    <td
                                                        class="px-6 py-4 whitespace-nowrap"
                                                    >

                                                        <JetButton class="ml-4 float-right border-tl p-4 m-4 border-gray-200" v-on:click="onClickUseSeries(item)"
                                                        >Use This Series
                                                        </JetButton>


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
        <div v-else class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-800 ">
                    <div
                        class="bg-white border-b border-gray-200 flex flex-col dark:bg-slate-800"
                    >
                        <JobCreation :seriesID="seriesID" @goToSeriesSelection="onBackJobCreation()"/>
                    </div>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
import {defineComponent} from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import JetButton from "@/Jetstream/Button.vue";
import JetInput from "@/Jetstream/Input.vue";
import JetCheckbox from "@/Jetstream/Checkbox.vue";
import JetLabel from "@/Jetstream/Label.vue";
import {usePage} from '@inertiajs/inertia-vue3'
import JobCreation from '@/Pages/Jobs/JobCreation.vue'


export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        JetInput,
        JetCheckbox,
        JetLabel,
        JobCreation
    },
    mounted() {
        this.items = usePage().props.value.series
        this.filtered()
    },
    data() {
        return {
            items: [],
            search: "",
            filteredItems: [],
            renderJobCreation: true,
            seriesID: ''
        };
    },
    methods: {
        onClickUseSeries: function (item) {
            this.seriesID = item.id
            this.renderJobCreation = false
        },
        onBackJobCreation: function () {
            this.renderJobCreation = true
        },
        filtered() {
            let se = [];
            if (this.search !== "") {
                se = this.items.filter(
                    (p) =>
                        p.name
                            .toLowerCase()
                            .includes(this.search.toLowerCase())
                );
            } else {
                se = this.items;
            }
            console.log(se)
            this.filteredItems = se;
        }
    }
});
</script>
