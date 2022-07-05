<template>
    <AppModal title="toto" :close-btn="true" :submit-btn="true">
        <div>Hello MOdal config heure</div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';

export default {
    components: {
        AppModal
    }
}
</script>