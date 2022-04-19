<template>
    <div v-if="show === true">
        <div class="flex flex-col absolute bottom-10 right-10">
            <div id="static-example" aria-atomic="true" aria-live="assertive" class="bg-green-500 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3" data-mdb-autohide="false" role="alert">
                <div class="bg-green-500 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-green-400 rounded-t-lg">
                    <p class="font-bold text-white flex items-center">
                        <svg aria-hidden="true" class="w-4 h-4 mr-2 fill-current" data-icon="check-circle" data-prefix="fas" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                                  fill="currentColor"></path>
                        </svg>
                        SUCCESS
                    </p>
                    <div class="flex items-center">
                        <button class='close m-2' style="cursor: pointer;" @click="hide()">X</button>
                    </div>
                </div>
                <div class="p-3 bg-green-500 rounded-b-lg break-words text-white">
                    {{ $page.props.flash.success }}
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
