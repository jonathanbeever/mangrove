<template>
    <app-layout v-if="!siteSelected" title="Import Data">
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
                            <TextInput
                                v-model="search"
                                class="p-4 mx-6 align-content-center dark:text-black"
                                placeholder="Search"
                                type="text"
                                v-on:change="filtered()"
                            />
                            <br/>
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
                                                    class="px-6 py-3 text-left font-medium text-neutral-900 uppercase tracking-wider"
                                                    scope="col"
                                                >
                                                    Site
                                                </th>
                                                <th
                                                    class="px-6 py-3 text-left font-medium text-neutral-900 uppercase tracking-wider"
                                                    scope="col"
                                                >
                                                    Location
                                                </th>
                                                <th
                                                    class="px-6 py-3 text-left font-medium text-neutral-900 uppercase tracking-wider"
                                                    scope="col"
                                                >
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody
                                                v-show="editPop == false"
                                                class="bg-white divide-y divide-gray-200"
                                            >
                                            <tr v-if="siteCreationEnabled">
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap"
                                                >
                                                    <TextInput v-model="siteCreationName" :value="siteCreationName" :maxlength="50" class="p-2 border-rounded-half border-b bg-slate-50 dark:text-black" placeholder="Site Name"/>

                                                </td>
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap"
                                                >
                                                    <TextInput v-model="siteCreationLocation" :value="siteCreationLocation" :maxlength="50" class="p-2 border-rounded-half border-b bg-slate-50 dark:text-black" placeholder="Location"/>
                                                </td>
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap"
                                                >
                                                    <PrimaryButton :disabled="siteCreationName.length == 0" class="float-right" v-on:click="onClickSiteSelectedNew()">Use This Site</PrimaryButton>
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
                                                    <PrimaryButton class="ml-4 float-right border-tl p-4 m-4 border-gray-200" v-on:click="onClickSiteSelected(item)">Use This Site</PrimaryButton>

                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PrimaryButton
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                        v-on:click="onClickCreateSite()"
                    >
                        {{ (!siteCreationEnabled) ? createNewSite : closeMenu }}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    </app-layout>
    <Series v-else :location="selectedLocation" :newSite="newSite" :siteID="siteID" :siteName="selectedName"/>
</template>

<script>
import {defineComponent} from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import Modal from "@/Pages/Partial/Modal.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import Checkbox from "@/Components/Checkbox.vue";
import InputLabel from "@/Components/InputLabel.vue";
import Series from "@/Pages/Jobs/Series.vue"
import {usePage} from '@inertiajs/vue3'


let editPop = false;
let siteCreationEnabled = false;

export default defineComponent({
    components: {
        AppLayout,
        PrimaryButton,
        TextInput,
        Checkbox,
        InputLabel,
        Modal,
        Series
    },
    computed: {},
    mounted() {
        this.items = usePage().props.sites
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
            selectedLocation: '',
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
