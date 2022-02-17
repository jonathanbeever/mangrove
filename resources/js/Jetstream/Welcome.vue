<template>
    <div class="bg-white border-b border-gray-200 flex flex-row">
        <div class="px-4 py-4">
            <form class="bg-gradient-to-r from-gray-200 shadow-md rounded px-4 pt-2 pb-4 mb-2 ">
                Filter Input Files
                <div>
                    <jet-label for="job" value="Site Name" class="mt-5"/>
                    <jet-input id="job" v-model="job" type="job" class="mt-1 mb-5 w-full border rounded py-2 px-3"/>
                </div>
                <div>
                    <jet-label for="name" value="File Set Name"/>
                    <jet-input id="name" type="name" class="mt-1 mb-5 w-full border rounded py-2 px-3"/>
                </div>
                <div>
                    <jet-label for="latitude" value="Latitude"/>
                    <jet-input id="latitude" type="latitude" class="mt-1 mb-5 w-full border rounded py-2 px-3"/>
                </div>
                <div>
                    <jet-label for="longitude" value="Longitude"/>
                    <jet-input id="longitude" type="longitude" class="mt-1 mb-5 w-full border rounded py-2 px-3"/>
                </div>
                <div class="flex items-center justify-center mt-4">
                    <jet-button class="ml-4">
                        Apply
                    </jet-button>
                </div>
            </form>
        </div>
        <div class="border-t border-gray-200 md:border-t-0 md:border-l flex flex-col">
            <div class="p-6 sm:px-5 flex">
                Sound Files
            </div>
            <div class="flex flex-col items-justify px-6">
                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Series</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recording Date</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude/Longitude</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="item in items" :key="item">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-start">
                                                <div class="">
                                                    <div class="text-sm font-medium text-gray-900">{{ item.job }}</div>
                                                    <div class="text-sm text-gray-500">{{ item.name }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ item.series }}</div>
                                            <div class="text-sm text-gray-500">{{ item.timestarted }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.date }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="text-sm text-gray-500">{{ item.latitude }}</div>
                                        <div class="text-sm text-gray-500">{{ item.longitude }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <!--a href="#" class="text-indigo-600 hover:text-indigo-900">x</a-->
                                            <input class="form-check-input appearance-none rounded-full h-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-100 align-center bg-no-repeat bg-center bg-contain float-right mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="{{count}}"/>
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
    <jet-button class="ml-4 float-right border-tl p-4 m-4 border-gray-200">
        Start New Jobs
    </jet-button>
    <jet-button class="ml-4 float-right border-tl p-4 m-4 border-gray-200">
        Upload New Files
    </jet-button>
</template>

<script>
    import { defineComponent } from 'vue'
    import JetButton from '@/Jetstream/Button.vue'
    import JetInput from '@/Jetstream/Input.vue'
    import JetCheckbox from '@/Jetstream/Checkbox.vue'
    import JetLabel from '@/Jetstream/Label.vue'
    import JetValidationErrors from '@/Jetstream/ValidationErrors.vue'

    export default defineComponent({
        components: {
            JetButton,
            JetInput,
            JetCheckbox,
            JetLabel,

        },
        data() {
            return {
                items: [{
                    job: 'Central Florida Zoo',
                    name: 'centralfloridazoo.zip',
                    series: 'That One series',
                    timestarted: '02/07/2022, 10:25pm',
                    date: '01/01/2011, 12:00am',
                    latitude: '02\'03\"40',
                    longitude: '02\'03\"40',
                    selected: false
                    },
                    {
                    job: 'Probably Florida Zoo',
                    name: 'probsafloridazoo.zip',
                    series: 'Spaghetti',
                    timestarted: '03/34/2022, 10:02pm',
                    date: '01/01/2011, 12:00am',
                    latitude: '02\'03\"40',
                    longitude: '02\'03\"40'
                    },{
                    job: 'Central Florida Zoo',
                    name: 'centralfloridazoo.zip',
                    series: 'That One series',
                    timestarted: '02/07/2022, 10:25pm',
                    date: '01/01/2011, 12:00am',
                    latitude: '02\'03\"40',
                    longitude: '02\'03\"40',
                    selected: false
                    }]
                }
            },

    })
</script>
