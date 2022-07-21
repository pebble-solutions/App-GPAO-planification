<template>
    <AppModal title="Modifier la tiemline à afficher" :close-btn="true" :submit-btn="true" @modal-hide="backPreviousRoute()" @submit="updateTimeline()">
        <div class="row">
            <div class="col">
                <label class="mx-1" for="datedebut">Date de début</label>
                <input type="date" :min="tmpProjet.ddp" :max="tmpProjet.dfp" class="form-control mx-1" id="datedebut" v-model="tmpTimeline.start">
            </div>

            <div class="col">
                <label class="mx-1" for="datefin">Date de fin</label>
                <input type="date" :min="tmpProjet.ddp" :max="tmpProjet.dfp" class="form-control mx-1" id="datefin" v-model="tmpTimeline.end">
            </div>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
import '@/js/date.js';

export default {
    props: {
        projet: Object,
        timeline: Object
    },

    data() {
        return {
            pending: {
                projet: false,
                adresse: false
            },
            projetInstance: null
        }
    },

    computed: {
        tmpProjet() {
            return this.initTmpProjet();
        },

        tmpTimeline() {
            return this.initTmpTimeline();
        }
    },

    components: {
        AppModal
    },

    methods: {

        /**
         * Initialise une copy de projet
         */
        initTmpProjet(){
            let tmpProjet = {};

            for(let key in this.projet){
                if(typeof this.projet[key] !== "object")
                    tmpProjet[key] = this.projet[key];
            }

            return tmpProjet;
        },

        /**
         * Initialise une copy de timeline
         */
        initTmpTimeline(){
            let tmpTimeline = {};

            for(let key in this.timeline){
                tmpTimeline[key] = this.timeline[key].getSqlDate();
            }

            return tmpTimeline;
        },
        
        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.push({name:"Ressources", params:{id: this.projet.id}});
        },
        
        /**
         * Send the timeline object to parent for get update and redirect to the route bofore the modal open
         */
        updateTimeline() {
            this.$emit('update-timeline', this.tmpTimeline);
            this.$router.push({name:"Ressources", params:{id: this.projet.id}});
        }

    },

    mounted() {
        this.projetInstance = this.projet
    }
}
</script>