<template>
    <AppModal title="Modifier la tiemline à afficher" :close-btn="true" :submit-btn="true" @modal-hide="backPreviousRoute()" @submit="updateTimeline()">
        <div class="row" v-if="!pending.timeline">
            <div class="col">
                <label class="mx-1" for="datedebut">Date de début</label>
                <input type="date" class="form-control mx-1" id="datedebut" v-model="tmpTimeline.start">
            </div>

            <div class="col">
                <label class="mx-1" for="datefin">Date de fin</label>
                <input type="date" class="form-control mx-1" id="datefin" v-model="tmpTimeline.end">
            </div>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
import '@/js/date.js';
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            pending: {
                timeline: true,
            },
            tmpTimeline: {
                start: null,
                end: null,
                now: new Date()
            },
            routeProjetListId: null
        }
    },

    computed: {
        ...mapState(['timeline']),
    },

    components: {AppModal},

    methods: { 
        ...mapActions(['refreshTimeline']),
        
        /**
         * Met à jour de la timeline du store
         */   
        updateTimeline() {
            this.tmpTimeline.start = new Date(this.tmpTimeline.start);
            this.tmpTimeline.end = new Date(this.tmpTimeline.end); 

            this.refreshTimeline(this.tmpTimeline);
            this.backPreviousRoute();
        },

        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.go(-1);
        },
    },

    mounted() {
        if(this.timeline) {
            this.tmpTimeline.start = this.timeline.start.getSqlDate();
            this.tmpTimeline.end = this.timeline.end.getSqlDate();
    
            this.pending.timeline = false
        }
    }
}
</script>