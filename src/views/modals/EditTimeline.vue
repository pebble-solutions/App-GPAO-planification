<template>
    <AppModal title="toto" :close-btn="true" :submit-btn="true">
        <div class="form-row">
            <div class="form-group col">
                <label class="mx-1" for="datedebut">Date de début</label>
                <input type="date" :min="tmpProjet.ddp" :max="tmpProjet.dfp" class="form-control mx-1" id="datedebut" v-model="timeline.start_filter">
            </div>

            <div class="form-group col">
                <label class="mx-1" for="datefin">Date de fin</label>
                <input type="date" :min="tmpProjet.ddp" :max="tmpProjet.dfp" class="form-control mx-1" id="datefin" v-model="timeline.end_filter">
            </div>
        </div>
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