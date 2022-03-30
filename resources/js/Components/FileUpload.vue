<template>
    <div class="flex flex-col grow dark:bg-slate-800">
        <div class="grow p-6 overflow-y-auto overflow-x-hidden max-h-96">
            <div class="-my-2 sm:-mx-6 lg:-mx-8">
                <div
                    class="py-4 align-middle inline-block min-w-full sm:px-6 lg:px-8"
                >
                    <div
                        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                    >
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Size
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Recording Date
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        File Type
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(item, index) in items" :key="index">
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
                                                    class="text-sm font-medium text-gray-900"
                                                    @click="edit = !edit"
                                                    v-if="item.job != ''"
                                                >
                                                    {{
                                                        (item.job =
                                                            item.name.split(".")[0])
                                                    }}
                                                </div>
                                                <div
                                                    class="text-sm font-medium text-gray-900 hover:text-violet-600"
                                                    @click="
                                                        item.edit = !item.edit
                                                    "
                                                    v-else
                                                >
                                                    empty
                                                </div>
                                                <div
                                                    class="text-sm text-gray-500"
                                                >
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
                                                class="text-sm font-medium text-gray-900"
                                                v-if="item.size != ''"
                                            >
                                                {{ item.size / 1e6 + "MB" }}
                                            </div>
                                            <div
                                                class="text-sm font-medium text-gray-900"
                                                v-else
                                            >
                                                undefined
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        class="py-4 whitespace-nowrap text-center text-sm text-gray-500"
                                    >
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                            v-if="item.date != ''"
                                        >
                                            {{ new Date(item.lastModified) }}
                                        </div>
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                            v-else
                                        >
                                            Today
                                        </div>
                                    </td>
                                    <td
                                        class="py-4 px-6 whitespace-nowrap text-right text-sm font-medium"
                                    >
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                            v-if="item.type != ''"
                                        >
                                            {{ item.type }}
                                        </div>
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                            v-else
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
        </div>
        <div class="p-8">
            <form @submit.prevent="formSubmit" enctype="multipart/form-data">
                <strong class="flex pt-4">Select New Files:</strong>
                <input
                    type="file"
                    class="form-control"
                    v-on:change="onFileChange"
                    multiple
                />
                <jet-button
                    class="float-right btn btn-success"
                    @click="saveInfo"
                    >Upload</jet-button
                >
            </form>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import JetButton from "@/Jetstream/Button.vue";

export default defineComponent({
    components: {
        JetButton,
    },

    props: ["items"],

    mounted() {
        //console.log("Component mounted.");
    },

    data() {
        return {
            edit: false,
        };
    },

    methods: {
        onFileChange(e) {
            this.file = e.target.files;
            //console.log(this.file);

            for (const i of Object.keys(this.file)) {
                this.items.push(this.file[i]);
            }
        },

        formSubmit(e) {
            e.preventDefault();
            let currentObj = this;
            const config = {
                headers: { "content-type": "multipart/form-data" },
            };
        },

        saveInfo(event) {
            //console.log(event);
            this.items = event.target.items;
            for (const i of Object.keys(this.items)) {
                formData.append("files", this.items[i]);
            }


        },
    },
});
</script>
