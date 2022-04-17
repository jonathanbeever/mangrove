<template>
    <app-layout title="Create Jobs">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight dark:text-white">
                Create Jobs
            </h2>
        </template>

        <div class="py-12" v-if="renderJobCreation">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-800 ">
                    <div
                        class="bg-white border-b border-gray-200 flex flex-col dark:bg-slate-800"
                    >
                        <div class="px-8 py-6">Select Series</div>
                        <div
                            class="flex flex-col"
                        >
                            <jet-input
                                type="text"
                                v-model="search"
                                placeholder="Search"
                                class="p-4 mx-6 align-content-center dark:text-black"
                                v-on:change="filtered()"
                            />
                            <br />
                            <div
                                class="flex flex-col px-6 overflow-y-auto overflow-x-hidden max-h-96"
                            >
                                <div class="">
                                    <div
                                        class="py-4 align-middle inline-block min-w-full"
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
                                                            class="px-6 py-3 text-left text-xs font-medium text-neutral-900 uppercase tracking-wider"
                                                        >
                                                            Series
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left text-xs font-medium text-neutral-900 uppercase tracking-wider"
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
                                                                class="flex items-start"
                                                            >
                                                                <div class="">
                                                                    <div
                                                                        class="text-sm font-medium text-gray-900"
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
                                                                class="flex items-start"
                                                            >
                                                                <div class="flex flex-row justify-end align-middle items-end">
                                                                    <jet-button v-on:click="onClickUseSeries(item)">Use This Series</jet-button>
                                                                </div>
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
         <div class="py-12" v-else>
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-800 ">
                    <div
                        class="bg-white border-b border-gray-200 flex flex-col dark:bg-slate-800"
                    >
                        <JobCreation @goToSeriesSelection="onBackJobCreation()"/>
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
import JetInput from "@/Jetstream/Input.vue";
import JetCheckbox from "@/Jetstream/Checkbox.vue";
import JetLabel from "@/Jetstream/Label.vue";
import JetValidationErrors from "@/Jetstream/ValidationErrors.vue";
import { usePage } from '@inertiajs/inertia-vue3'
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
            renderJobCreation: true
        };
    },
    methods: {
        onClickUseSeries: function (item) {
            console.log(item)
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
