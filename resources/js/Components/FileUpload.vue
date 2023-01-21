<template>

    <div class="flex flex-col grow dark:bg-slate-900 shadow-inner shadow-sky-200 dark:shadow-cyan-500">
        <div class="p-4 mb-2">
            <h2
                class="font-semibold text-xl text-gray-800 leading-tight dark:text-white"
            >
                Series Selection
            </h2>
        </div>

        <div class="grow p-2 overflow-y-auto overflow-x-hidden max-h-96">
            <div class="align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div
                    class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                >
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left font-medium text-neutral-900 uppercase tracking-wider"
                                scope="col"
                            >
                                Name
                            </th>
                            <th
                                class="px-6 py-3 text-right font-medium text-neutral-900 uppercase tracking-wider"
                                scope="col"
                            >
                                Size
                            </th>
                            <th
                                class="px-6 py-3 text-center font-medium text-neutral-900 uppercase tracking-wider"
                                scope="col"
                            >
                                Recording Date
                            </th>
                            <th
                                class="px-6 py-3 text-right font-medium text-neutral-900 uppercase tracking-wider"
                                scope="col"
                            >
                                File Type
                            </th>
                        </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, index) in filtered" :key="index">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-start">
                                    <div>
                                        <!--input
                                                type="text"
                                                v-model="item.job"
                                                v-if="edit == true"
                                                v-on:blur="
                                                    edit = !edit;
                                                    $emit('update');
                                                "
                                            /-->
                                        <div
                                            v-if="item.job != ''"
                                            class="text-sm font-medium text-gray-900"
                                            @click="edit = !edit"
                                        >
                                            {{
                                                (item.job =
                                                    item.name.split(".")[0])
                                            }}
                                        </div>
                                        <div
                                            v-else
                                            class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                            @click="item.edit = !item.edit"
                                        >
                                            empty
                                        </div>
                                        <div class="text-sm text-neutral-900">
                                            {{ item.name }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-right"
                            >
                                <div>
                                    <div
                                        v-if="item.size != ''"
                                        class="text-sm font-medium text-gray-900"
                                    >
                                        {{ item.size / 1e6 + "MB" }}
                                    </div>
                                    <div
                                        v-else
                                        class="text-sm font-medium text-gray-900"
                                    >
                                        undefined
                                    </div>
                                </div>
                            </td>
                            <td
                                class="py-4 whitespace-nowrap text-center text-sm text-neutral-900"
                            >
                                <div
                                    v-if="item.date != ''"
                                    class="text-sm font-medium text-gray-900"
                                >
                                    {{ new Date(item.lastModified) }}
                                </div>
                                <div
                                    v-else
                                    class="text-sm font-medium text-gray-900"
                                >
                                    Today
                                </div>
                            </td>
                            <td
                                class="py-4 px-6 whitespace-nowrap text-right text-sm font-medium"
                            >
                                <div
                                    v-if="item.type != ''"
                                    class="text-sm font-medium text-gray-900"
                                >
                                    {{ item.type }}
                                </div>
                                <div
                                    v-else
                                    class="text-sm font-medium text-gray-900"
                                >
                                    unknown
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="p-12 flex flex-row justify-between">
            <!--Folder file submission-->
            <form enctype="multipart/form-data" @submit.prevent="formSubmit">
                <strong class="flex pt-4">Select New Folders:</strong>
                <input
                    class="form-control"
                    directory
                    multiple
                    type="file"
                    webkitdirectory
                    v-on:change="onFileChange"
                />
            </form>
            <!--Meta-Data file submission-->
            <form
                accept=".txt, .csv"
                class=""
                enctype="multipart/form-data"
                @submit.prevent="formSubmit"
            >
                <strong class="flex pt-4">Upload Meta-Data:</strong>
                <input
                    class="form-control"
                    type="file"
                    v-on:change="onMetaChange($event)"
                />
            </form>

        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";

export default defineComponent({
    components: {
        PrimaryButton,
        TextInput,
    },

    props: ["items", "meta"],

    mounted() {
    },

    data() {
        return {
            edit: false,
            search: "",
        };
    },

    computed: {
        filtered() {
            let se = [];
            if (this.search !== "") {
                se = this.items.filter((p) =>
                    p.name.toLowerCase().includes(this.search.toLowerCase())
                );
            } else {
                se = this.items;
            }
            return se;
        },
    },

    methods: {
        onFileChange(e) {
            if (this.items.length > 0)
                this.items.splice(0, this.items.length)

            const file = e.target.files;

            for (const i of Object.keys(file)) {
                if (file[i].name.split('.').pop() == "wav")
                    this.items.push(file[i]);
            }
        },
        onMetaChange(e) {
            if (this.meta && this.meta.length > 0)
                this.meta.splice(0, this.meta.length)

            const file = e.target.files;
            const fileExtension = file[0].name.split('.').pop();

            if (fileExtension == "txt" || fileExtension == "csv")
                this.meta.push(file[0]);
        },
        formSubmit(e) {
            e.preventDefault();
            let currentObj = this;
            const config = {
                headers: {"content-type": "multipart/form-data"},
            };
        },

        saveInfo(event) {
            this.items = event.target.items;
            for (const i of Object.keys(this.items)) {
                formData.append("files", this.items[i]);
            }
        },
    },
});
</script>
