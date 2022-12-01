<template>
    <AppModal title="Modifier la tiemline à afficher" :close-btn="true" :submit-btn="true" @modal-hide="backPreviousRoute()" @submit="updateTimeline()">
        <div class="row" v-if="!pending.timeline">
            <div class="col">
                <label class="mx-1" for="datedebut">Date de début</label>
                <input type="date" :min="minProjetDate" :max="maxProjetDate" class="form-control mx-1" id="datedebut" v-model="tmpTimeline.start">
            </div>

            <div class="col">
                <label class="mx-1" for="datefin">Date de fin</label>
                <input type="date" :min="minProjetDate" :max="maxProjetDate" class="form-control mx-1" id="datefin" v-model="tmpTimeline.end">
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
                projet: false,
                adresse: false,
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
        ...mapState(['projetsList', 'timeline']),

        /**
         * Retourne la date de début la plus ancienne par rapport à la liste de projet
         */
        minProjetDate() {
            if (0 == this.projetsList.length) {
                return this.tmpTimeline.start;
            }

            let minDate = null;

            this.projetsList.forEach(projet => {
                if (!minDate || minDate > projet.ddp) {
                    minDate = projet.ddp;
                }
            });
            

            return minDate;
        },

        /**
         * Retourne la date de fin la plus loin par rapport à la liste de projet
         */
        maxProjetDate() {
            if (0 == this.projetsList.length) {
                return this.tmpTimeline.end;
            }

            let maxDate = null;

            return maxDate;
        }
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeProjetListId = from.params.projetListId;
        })
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
            this.$router.push({name:"Ressources", params:{projetListId: this.routeProjetListId}});
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