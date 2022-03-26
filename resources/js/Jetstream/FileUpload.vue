<template>
        <div class="flex flex-col justify-content-center p-8">
            <div v-if="success != ''" class="alert alert-success" role="alert">
                {{success}}
            </div>
            <form @submit="formSubmit" enctype="multipart/form-data">
            <strong class="flex">Name:</strong>
            <input type="text" class="form-control" v-model="name">
            <strong> File: </strong>
            <input type="file" class="form-control" v-on:change="onFileChange">
            <jet-button class="btn btn-success">Submit</jet-button>
            </form>
        </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import JetButton from '@/Jetstream/Button.vue'

    export default defineComponent({

         components: {
            JetButton,

        },

        mounted() {
            console.log('Component mounted.')
        },

        data() {
            return {
              name: '',
              file: '',
              success: ''
            };
        },

        methods: {
            onFileChange(e){
                console.log(e.target.files[0]);
                this.file = e.target.files[0];
            },

            formSubmit(e) {
                e.preventDefault();
                let currentObj = this;
                const config = {
                    headers: { 'content-type': 'multipart/form-data' }
                }

                let formData = new FormData();
                formData.append('file', this.file);
                axios.post('/formSubmit', formData, config)
                .then(function (response) {
                    currentObj.success = response.data.success;
                })
                .catch(function (error) {
                    currentObj.output = error;
                });
            }
        }
    })

</script>
