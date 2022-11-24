<template>
    <AppModal title="Modifier la tiemline à afficher" :close-btn="true" :submit-btn="true" @modal-hide="backPreviousRoute()" @submit="updateTimeline()">
        <div class="row" v-if="!pending.timeline">
            <div class="col">
                <label class="mx-1" for="datedebut">Date de début</label>
                <input type="date" :min="projet.ddp" :max="projet.dfp" class="form-control mx-1" id="datedebut" v-model="tmpTimeline.start">
            </div>

            <div class="col">
                <label class="mx-1" for="datefin">Date de fin</label>
                <input type="date" :min="projet.ddp" :max="projet.dfp" class="form-control mx-1" id="datefin" v-model="tmpTimeline.end">
            </div>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
import '@/js/date.js';
import { mapActions, mapState } from 'vuex';
//import date from 'date-and-time';

export default {
    data() {
        return {
            pending: {
                projet: false,
                adresse: false,
                timeline: true,
            },
            tmpTimeline: {
                start: null,
                end: null,
                now: new Date()
            }
        }
    },

    computed: {
        ...mapState(['projet', 'timeline']),

        // tmpTimeline() {
        //     return this.timeline;
        // },

        // start() {
        //     return this.tmpTimeline.start.getSqlDate();
        // },

        // end() {
        //     return this.tmpTimeline.end.getSqlDate();
        // }
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
            this.$router.push({name:"Ressources", params:{id: this.projet.id}});
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