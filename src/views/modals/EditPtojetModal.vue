<template>
    <AppModal title="Modifier le projet" :pending="pending.projet" :cancel-btn="true" :submit-btn="true" class-list="modal-lg" @submit="recordProjet()">
        <div v-if="tmpProjet" class="d-flex">
            <div class="flex-fill">
                <div class="mb-3">
                    <label for="projet_intitule" class="form-label">Nom</label>
                    <input type="text" class="form-control" v-model="tmpProjet.intitule" id="projet_intitule">
                </div>
    
                <div class="mb-3">
                    <label for="pojet_desc" class="form-label">Description</label>
                    <textarea class="form-control" v-model="tmpProjet.description" id="projet_desc"></textarea>
                </div>
        
                <div class="form-row">
                    <div class="mb-3 col-6">
                        <label for="projet_ddp" class="form-label">Date de début</label>
                        <input type="date" class="form-control" v-model="tmpProjet.ddp" id="projet_ddp">
                    </div>
        
                    <div class="mb-3 col-6">
                        <label for="projet_dfp" class="form-label">Date de fin</label>
                        <input type="date" class="form-control" v-model="tmpProjet.dfp" id="projet_dfp">
                    </div>
                </div>
        
                <div class="mb-3">
                    <label for="projet_adresse_voie" class="form-label">Voie</label>
                    <input type="text" class="form-control" v-model="tmpProjet.oAdresse.voie" id="projet_adresse_voie">
                </div>
        
                <div class="form-row">
                    <div class="mb-3 col-4">
                        <label for="projet_adresse_cp" class="form-label">Code postal</label>
                        <input type="text" class="form-control" v-model="tmpProjet.oAdresse.cp" id="projet_adresse_cp">
                    </div>
    
                    <div class="mb-3 col-8">
                        <label for="projet_adresse_ville" class="form-label">Ville</label>
                        <input type="text" class="form-control" v-model="tmpProjet.oAdresse.localite" id="projet_adresse_ville">
                    </div>
                </div>
            </div>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';

export default {
    props: {
        projet: Object,
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
            return this.initTmpProje();
        }
    },

    components: {
        AppModal
    },

    methods: {
        /**
         * recordProjet(props)
         * Enregistre les valeurs du formulaire de la modification du projet et de l'adresse du projet
         * Traitement au retour
         */
        recordProjet(){
            this.pending.projet = true;
            this.pending.adresse = true;

            let urlApiProjet = "/projet/POST/"+this.projet.id +"/";
            let urlApiAdresse = "/adresse/POST/"+this.projet.oAdresse.id;


            this.$app.apiPost(urlApiProjet, this.tmpProjet)
            .then( (data) => {
                for(let key in data){
                    this.projetInstance[key] = data[key];
                }

                this.pending.projet = false;
            }).catch(this.$app.catchError);


            this.$app.apiPost(urlApiAdresse, this.tmpProjet.oAdresse)
            .then( (data) => {
                for(let key in data){
                    this.projetInstance.oAdresse[key] = data[key]; 
                }
            }) .catch(this.$app.catchError);


            self.pending.adresse = false;
        },

         /**
         * Initialise une copy de projet
         */
        initTmpProje(){
            let tmpProjet = {};
            tmpProjet.oAdresse = {};

            for(let key in this.projet){
                if(typeof this.projet[key] !== "object")
                    tmpProjet[key] = this.projet[key];
            }

            for(let key in this.projet.oAdresse){
                if(typeof this.projet.oAdresse[key] !== "object")
                    tmpProjet.oAdresse[key] = this.projet.oAdresse[key];
            }
        },
    },

    mounted() {
        this.projetInstance = this.projet
    }
}
</script>