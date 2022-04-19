<template>
    <div v-if="show === true">
        <div class="flex flex-col absolute bottom-10 right-10">
            <div id="static-example" aria-atomic="true" aria-live="assertive" class="bg-red-600 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3" data-mdb-autohide="false" role="alert">
                <div class="bg-red-600 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-red-500 rounded-t-lg">
                    <p class="font-bold text-white flex items-center">
                        <svg aria-hidden="true" class="w-4 h-4 mr-2 fill-current" data-icon="times-circle" data-prefix="fas" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                                  fill="currentColor"></path>
                        </svg>
                        ERROR
                    </p>
                    <div class="flex items-center">
                        <button class='close m-2' style="cursor: pointer;" @click="hide()">X</button>
                    </div>
                </div>
                <div class="p-3 bg-red-600 rounded-b-lg break-words text-white">
                    {{ $page.props.flash.failure }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props: [],

    data() {
        return {
            show: true
        };
    },
    methods: {
        hide: function () {
            this.show = false;
        }
    }
};
</script>
