<template>
    <app-layout title="Admin Panel">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Admin Panel
            </h2>
        </template>
        <div class="py-12">
            <div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
                <div
                    class="bg-white overflow-hidden shadow-xl sm:rounded-lg dark:bg-slate-800"
                >
                    <div class="border-gray-200 flex flex-row p-4">
                        <div class="py-4 align-middle inline-block min-w-full">
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
                                                Username
                                            </th>
                                            <th
                                                scope="col"
                                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Email
                                            </th>
                                            <th
                                                scope="col"
                                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Login
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        class="bg-white divide-y divide-gray-200"
                                    >
                                        <tr
                                            v-for="(item, index) in userTable"
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
                                                <JetButton v-on:click="loginUser(item.id)">Login</JetButton>
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
    </app-layout>
</template>

<script>
import { defineComponent } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import JetButton from "@/Jetstream/Button.vue";

let userTable = {};

export default defineComponent({
    components: {
        AppLayout,
        JetButton,
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
        getTable: async function() {
            try {
                const response = await axios.get('/admin/users/paginate');
                return response.data.data;
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        loginUser: async function(user_id) {
            if (typeof user_id !== 'undefined' && user_id !== null) {
                try {
                    await axios.post('/admin/impersonate', {
                        user_id: user_id
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    },

});
</script>
