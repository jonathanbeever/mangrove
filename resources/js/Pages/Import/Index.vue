<template>
    <app-layout title="Import Data" v-if="!siteSelected">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight dark:text-white pl-8">
                Import Data
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-900 shadow-inner shadow-sky-200 dark:shadow-cyan-500">
                    <div
                        class="bg-white border-b border-gray-200 flex flex-col dark:bg-slate-900 shadow-inner shadow-sky-200 dark:shadow-cyan-500"
                    >
                        <div class="px-8 py-6">Select or Create a Site</div>
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
                                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase tracking-wider"
                                                        >
                                                            Site
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase tracking-wider"
                                                        >
                                                            Location
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left font-medium text-neutral-900 uppercase tracking-wider"
                                                        >
                                                        </th>
                                                    </tr>
                                                </thead>
                                               <tbody
                                                    class="bg-white divide-y divide-gray-200"
                                                    v-show="editPop == false"
                                                >
                                                    <tr v-if="siteCreationEnabled">
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap"
                                                        >
                                                                    <jet-input class="p-2 border-rounded-half border-b bg-slate-50 dark:text-black" :value="siteCreationName" v-model="siteCreationName" placeholder="Site Name"/>

                                                        </td>
                                                         <td
                                                            class="px-6 py-4 whitespace-nowrap"
                                                        >
                                                                    <jet-input class="p-2 border-rounded-half border-b bg-slate-50 dark:text-black" :value="siteCreationLocation" v-model="siteCreationLocation" placeholder="Location"/>
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap"
                                                        >
                                                                    <jet-button v-on:click="onClickSiteSelectedNew()" :disabled="siteCreationName.length == 0" class="float-right">Use This Site</jet-button>
                                                        </td>
                                                    </tr>
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
                                                                <div class="">
                                                                    <div
                                                                        class="text-sm text-gray-500"
                                                                    >
                                                                        {{
                                                                            item.location
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
                                                                <div class="flex flex-row justify-center align-middle items-center">
                                                                    <jet-button v-on:click="onClickSiteSelected(item)">Use This Site</jet-button>
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
                    <jet-button
                        v-on:click="onClickCreateSite()"
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                    >
                        {{(!siteCreationEnabled) ? createNewSite : closeMenu}}
                    </jet-button>
                </div>
            </div>
        </div>
    </app-layout>
    <Series :newSite="newSite" :siteID="siteID" :siteName="selectedName" :location="selectedLocation" v-else/>
</template>

<script>
import { defineComponent } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import Modal from "@/Pages/Partial/Modal.vue";
import JetButton from "@/Jetstream/Button.vue";
import JetInput from "@/Jetstream/Input.vue";
import JetCheckbox from "@/Jetstream/Checkbox.vue";
import JetLabel from "@/Jetstream/Label.vue";
import JetValidationErrors from "@/Jetstream/ValidationErrors.vue";
import Series from "@/Pages/Jobs/Series.vue"
import { usePage } from '@inertiajs/inertia-vue3'


let editPop = false;
let siteCreationEnabled = false;

export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        JetInput,
        JetCheckbox,
        JetLabel,
        Modal,
        Series
    },
    computed: {
    },
    mounted() {
        this.items = usePage().props.value.sites
        this.filtered()
    },
    data() {
        return {
            items: [],
            search: "",
            editPop,
            siteCreationEnabled: siteCreationEnabled,
            siteCreationName: '',
            siteCreationLocation: '',
            createNewSite: 'Create New Site',
            closeMenu: 'Close Site Creation',
            siteSelected: false,
            selectedName: '',
            selectedLocation:'',
            newSite: false,
            siteID: '',
            filteredItems: []
        };
    },
    methods: {
        edit: function () {
            this.editPop = !this.editPop;
        },
        pushEdits: function () {
            this.editPop = !this.editPop;

        },
        onClickCreateSite: function () {
            this.siteCreationEnabled = !this.siteCreationEnabled
        },
        onClickSiteSelectedNew: function () {
            this.newSite = true;
            this.selectedLocation = this.siteCreationLocation
            this.selectedName = this.siteCreationName

            this.siteSelected = true;
        },
        onClickSiteSelected: function (item) {
            this.newSite = false
            this.selectedLocation = item.name
            this.selectedName = item.location
            this.siteID = item.id

            this.siteSelected = true
        },
        filtered() {
            let se = [];
            if (this.search !== "") {
                se = this.items.filter(
                    (p) =>
                        p.name
                            .toLowerCase()
                            .includes(this.search.toLowerCase()) ||
                        p.location
                            .toLowerCase()
                            .includes(this.search.toLowerCase())
                );
            } else {
                se = this.items;
            }
            this.filteredItems = se;
        }
    },
});
</script>
