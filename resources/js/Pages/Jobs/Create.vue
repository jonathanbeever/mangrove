<template>
    <app-layout title="Create Jobs">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Create Jobs
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-800 ">
                    <div
                        class="bg-white border-b border-gray-200 flex flex-col dark:bg-slate-800"
                        v-if="newUploads && !goToJobCreation"
                    >
                        <div class="px-8 py-6">Sound Files</div>
                        <div
                            class="border-t border-gray-200 md:border-t-0 md:border-l flex flex-col"
                        >
                            <jet-input
                                type="text"
                                v-model="search"
                                placeholder="Search"
                                class="p-4 mx-6 align-content-center dark:text-black"
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
                                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Site
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Series &amp; Size
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Recording Date
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Latitude/Longitude
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Select
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <Modal
                                                    v-show="editPop == true"
                                                    :selected="selected"
                                                    :items="items"
                                                />
                                                <tbody
                                                    class="bg-white divide-y divide-gray-200"
                                                    v-show="editPop == false"
                                                >
                                                    <tr
                                                        v-for="(
                                                            item, index
                                                        ) in filtered"
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
                                                                            item.job
                                                                        }}
                                                                    </div>
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
                                                            class="px-6 py-4 whitespace-nowrap dark:text-black"
                                                        >
                                                            <div
                                                                class="text-sm text-gray-900"

                                                            >
                                                                {{
                                                                    item.series || 'N/A'
                                                                }}
                                                            </div>

                                                            <div
                                                                class="text-sm text-gray-500"
                                                            >
                                                                {{
                                                                    item.size / 1e6 + "MB"
                                                                }}
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                                        >
                                                            {{ new Date(item.lastModified) }}
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium dark:text-black"
                                                        >
                                                            <div
                                                                class="text-sm text-gray-500"
                                                                v-if="item.latitude != null"
                                                            >
                                                                {{
                                                                    item.latitude
                                                                }}
                                                            </div>
                                                            <div
                                                            v-else>
                                                            0'00"00
                                                            </div>
                                                            <div
                                                                class="text-sm text-gray-500"
                                                                v-if="item.longitude != null"
                                                            >
                                                                {{
                                                                    item.longitude
                                                                }}
                                                            </div>
                                                            <div
                                                            v-else>
                                                            0'00"00
                                                            </div>
                                                        </td>
                                                        <td
                                                            class="px-8 py-4 whitespace-nowrap text-sm font-medium"
                                                        >
                                                            <!--a href="#" class="text-indigo-600 hover:text-indigo-900">x</a-->
                                                            <input
                                                                class="form-check-input appearance-none rounded-full h-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-100 align-center bg-no-repeat bg-center bg-contain cursor-pointer"
                                                                type="checkbox"
                                                                name="flexRadioDefault"
                                                                id="{{item.job}}"
                                                                v-on:click="() => {
                                                                    item.selected = !item.selected
                                                                    anySelected()
                                                                }
                                                                "
                                                            />
                                                            <!--jet-checkbox name="{{item.count}}" v-model:checked="item.selected" /-->
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
                    <JobCreation
                        v-if="goToJobCreation"
                        @goToFileSelection="onBackJobCreation()"
                    />
                    <div
                        class="bg-white border-b border-gray-200 flex flex-row"
                        v-if="newUploads == false"
                    >
                        <fileUpload :items="items" />
                    </div>
                    <jet-button
                        v-if="newUploads == true && goToJobCreation == false && editPop == false"
                        v-on:click="renderJobCreation"
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                        :disabled="!somethingSelected"
                    >
                        Start New Jobs
                    </jet-button>
                    <jet-button
                        v-if="newUploads == true && goToJobCreation == false"
                        v-on:click="newUploads = !newUploads"
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                    >
                        Upload New Files
                    </jet-button>
                    <jet-button
                        v-if="
                            newUploads == true &&
                            goToJobCreation == false &&
                            editPop == false
                        "
                        v-on:click="edit"
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                        :disabled="!somethingSelected"
                    >
                        Edit Selected Files
                    </jet-button>
                    <jet-button
                        v-if="
                            newUploads == true &&
                            goToJobCreation == false &&
                            editPop == true
                        "
                        v-on:click="pushEdits"
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                    >
                        Save
                    </jet-button>
                    <jet-button
                        v-if="newUploads == false"
                        v-on:click="newUploads = !newUploads"
                        class="ml-4 float-right border-tl p-4 m-4 border-gray-200"
                    >
                        Return to Files
                    </jet-button>
                </div>
            </div>
        </div>
    </app-layout>
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
import FileUpload from "@/Components/FileUpload.vue";
import JobCreation from "@/Pages/Jobs/JobCreation.vue";

let goToJobCreation = false;
let newUploads = true;
let editPop = false;
let selected = [];
let somethingSelected = false;
export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        JetInput,
        JetCheckbox,
        JetLabel,
        FileUpload,
        JobCreation,
        Modal,
    },
    computed: {
        filtered() {
            let se = [];
            if (this.search !== "") {
                se = this.items.filter(
                    (p) =>
                        p.job
                            .toLowerCase()
                            .includes(this.search.toLowerCase()) ||
                        p.name
                            .toLowerCase()
                            .includes(this.search.toLowerCase()) //||
                        // p.series
                        //     .toLowerCase()
                        //     .includes(this.search.toLowerCase()) ||
                        // new Date(p.lastModified)
                        //     .toLowerCase()
                        //     .includes(this.search.toLowerCase()) ||
                        // p.latitude
                        //     .toLowerCase()
                        //     .includes(this.search.toLowerCase()) ||
                        // p.longitude
                        //     .toLowerCase()
                        //     .includes(this.search.toLowerCase())
                );
            } else {
                se = this.items;
            }
            return se;
        }
    },
    data() {
        return {
            newUploads,
            goToJobCreation,
            somethingSelected: false,
            items: [],
            search: "",
            editPop,
            selected

        };
    },
    methods: {
        onBackJobCreation: function () {
            this.goToJobCreation = false;
            this.newUploads = true;
            this.selected = []
            this.somethingSelected = false
            return;
        },
        removeAllSelected: function () {
            this.items.forEach(x => x.selected = false)
        },
        renderJobCreation: function () {
            this.removeAllSelected()
            this.goToJobCreation = true;
            return;
        },
        edit: function () {
            this.$emit("editPop");
            this.editPop = !this.editPop;
            return;
        },
        pushEdits: function () {
            console.log("savepls");
            this.editPop = !this.editPop;

        },
        anySelected: function () {
            let e = this.items.filter((p) => p.selected == true);
            if (e.length > 0) {
                this.selected = e;
                //console.log(this.selected);
                this.somethingSelected = true;
                return false;
            } else {
                this.somethingSelected = false;
                return true;
            }
        }
    },
});
</script>
