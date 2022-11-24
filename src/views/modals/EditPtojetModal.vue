<template>
    <AppModal title="Modifier le projet" :pending="pending.projet" :cancel-btn="true" :submit-btn="true" size="lg" @submit="recordProjet()" @modal-hide="backPreviousRoute()">
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
        
                <div class="row mb-3">
                    <div class="col">
                        <label for="projet_ddp" class="form-label">Date de début</label>
                        <input type="date" class="form-control" v-model="tmpProjet.ddp" id="projet_ddp">
                    </div>
        
                    <div class="col">
                        <label for="projet_dfp" class="form-label">Date de fin</label>
                        <input type="date" class="form-control" v-model="tmpProjet.dfp" id="projet_dfp">
                    </div>
                </div>
        
                <div class="mb-3">
                    <label for="projet_adresse_voie" class="form-label">Voie</label>
                    <input type="text" class="form-control" v-model="tmpProjet.oAdresse.voie" id="projet_adresse_voie">
                </div>
        
                <div class="row">
                    <div class="col">
                        <label for="projet_adresse_cp" class="col-form-label">Code postal</label>
                        <input type="text" class="form-control" v-model="tmpProjet.oAdresse.cp" id="projet_adresse_cp">
                    </div>
    
                    <div class="col">
                        <label for="projet_adresse_ville" class="col-form-label">Ville</label>
                        <input type="text" class="form-control" v-model="tmpProjet.oAdresse.localite" id="projet_adresse_ville">
                    </div>
                </div>
            </div>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            pending: {
                projet: false,
                adresse: false
            }
        }
    },

    computed: {
        ...mapState(['projet']),

        /**
         * instance une copy du projet
         */
        tmpProjet() {
            return this.initTmpProjet();
        }
    },

    components: {AppModal},

    methods: {
        ...mapActions(['refreshProjet']),

        /**
         * Enregistre les valeurs du formulaire de la modification du projet et au retour envi le projet a la methode updateOAdresseFromProjet
         */
        recordProjet(){
            this.pending.projet = true;
            this.pending.adresse = true;

            let urlApiProjet = "/projet/POST/"+this.projet.id +"/";

            this.$app.apiPost(urlApiProjet, this.tmpProjet)
            .then( (data) => {
                this.updateOAdresseFromProjet(data);

                this.pending.projet = false;
            }).catch(this.$app.catchError);
        },

        /**
         * Récupere les information de l'adresse du projet et Met a jour dans le store le projet
         * 
         * @param {Object} newProjet object projet return par l'api
         */
        updateOAdresseFromProjet(newProjet) {
            let urlApiAdresse = "/adresse/POST/"+this.projet.oAdresse.id;

            this.$app.apiPost(urlApiAdresse, this.tmpProjet.oAdresse)
            .then( (data) => {
                newProjet.oAdresse = data;
                this.refreshProjet(newProjet);

                this.pending.adresse = false;
                this.backPreviousRoute();
            }) .catch(this.$app.catchError);
        },

         /**
         * Initialise une copy de projet
         */
        initTmpProjet(){
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

            return tmpProjet;
        },
        
        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.push({name:"Ressources", params:{id: this.projet.id}});
        }
    }
}
</script>