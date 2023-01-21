<template>
    <app-layout title="Admin Panel">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight dark:text-white pl-8">
                Admin Panel
            </h2>
        </template>
        <div class="py-12">
            <div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
                <div
                    class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-800"
                >
                    <div class="align-middle inline-block min-w-full h-3/5">
                        <div
                            class="shadow overflow-hidden sm:rounded-lg overflow-y-auto overflow-x-hidden"
                        >
                            <table
                                class="min-w-full divide-y divide-gray-200"
                            >
                                <thead class="bg-gray-50 sticky top-0">
                                <tr>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-neutral-900 uppercase tracking-wider"
                                        scope="col"
                                    >
                                        Username
                                    </th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-neutral-900 uppercase tracking-wider"
                                        scope="col"
                                    >
                                        Email
                                    </th>
                                    <th
                                        class="px-6 py-3 text-right text-xs font-medium text-neutral-900 uppercase tracking-wider"
                                        scope="col"
                                    >
                                        Login
                                    </th>
                                </tr>
                                </thead>
                                <tbody
                                    class="bg-white divide-y divide-gray-200"
                                >
                                <tr
                                    v-for="(item, index) in userTable.data"
                                    :key="index"
                                >
                                    <td
                                        class="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                        >
                                            {{ item.name }}
                                        </div>
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap dark:text-black text-center"
                                    >
                                        <div
                                            class="text-sm text-gray-900"
                                        >
                                            {{ item.email }}
                                        </div>
                                    </td>

                                    <td
                                        class="px-4 py-4 whitespace-nowrap text-sm font-medium float-right"
                                    >
                                        <PrimaryButton
                                            v-on:click="
                                                        loginUser(item.id)
                                                    "
                                        >Login
                                        </PrimaryButton
                                        >
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <div class="flex flex-wrap">
                                <template
                                    v-for="(link, p) in userTable.links"
                                    :key="p"
                                >
                                    <div
                                        v-if="link.url === null"
                                        class="m-4 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                                        v-html="link.label"
                                    />
                                    <Button
                                        v-else
                                        :class="{
                                                    'bg-blue-700 text-black':
                                                        link.active,
                                                }"
                                        :href="link.url"
                                        class="m-4 px-4 py-3 text-sm border rounded dark:bg-white dark:text-black dark:hover:bg-slate-900 hover:bg-white focus:border-indigo-500 focus:text-indigo-500"
                                        v-on:click="nextPage(link.url)"
                                        v-html="link.label"
                                    />
                                </template>

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

let userTable = {};
let nextPage;

export default defineComponent({
    components: {
        AppLayout,
        PrimaryButton,
    },
    data() {
        return {
            userTable,
        };
    },

    async mounted(e) {
        this.userTable = await this.getTable();
    },
    methods: {
        nextPage: async function (e) {
            //console.log(e)
            this.userTable = await this.getTable(e);
        },
        getTable: async function (page = "/admin/users/paginate") {
            try {
                const response = await axios.get(page);
                return response.data;
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        loginUser: async function (user_id) {
            if (typeof user_id !== "undefined" && user_id !== null) {
                window.location.replace(route("impersonate", user_id));
            }
        },
    },
});
</script>
