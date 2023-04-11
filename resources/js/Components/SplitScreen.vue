<template>
<div class="flex flex-row">
    <slot name="left" >

    </slot>
    <!-- Draggable thing -->
    <slot name="right" >

    </slot>
</div>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
    data() {
        return {

        }
    }
    // onDrag watcher?
})
</script>
