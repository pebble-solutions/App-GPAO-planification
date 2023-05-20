<template>
    <AppModal 
        title="Ajouter un projet"
        class-Name="modal-dialog-scrollable"
        submit-label = "Valider"

        :pending="pending.metiersActifs" 
        :submit-btn="true" 
        :cancel-btn="true"

        @modal-hide="backPreviousRoute()"
        @submit="confirmFilter()"
    >
        <form method="post" @submit.prevent="searchMetiers()">
            <div class="input-group mb-3">
                <input type="text" placeholder="Rechercher un projet" class="form-control" v-model="search_metiers.keyword"> 

                <button type="submit" class="btn btn-outline-secondary">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </form>

        <AlertMessage v-if="ressourcesRHType.length == 0">
            Il n'y a aucun résultat à la recherche. Cette liste n'affiche que les ressources créer. Pour 
            créer des ressources, ouvrez le module ressources.
        </AlertMessage>
        

        <div v-else class="list-group list-group-flush">
            <div v-for="ressource in ressourcesRHType" :key="'ressource-'+ressource.id" class="list-group-item">       
                <div class="form-check text-nowrap">
                    <input type="checkbox" class="form-check-input" :id="'ckb-ressource-'+ressource.id" :value="ressource.id" v-model="checkedRessourcesId" :aria-label="ressource.nom" name="checkedRessourcesId[]">
                    <label class="form-check-label" :for="'ckb-ressource-'+ressource.id">
                        <h6>{{ressource.nom}}</h6>
                    </label>
                </div>
            </div>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';

import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            pending: {
                metiersActifs: false
            },
            search_metiers: {
                keyword: ''
            },
            checkedRessourcesId: [],
            routeProjetListId: null
        }
    },

    computed: {
        ...mapState(['timeline', 'filterRessources', 'ressourcesRHType'])
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeProjetListId = from.params.projetListId;
        })
    },  

    components: { AppModal, AlertMessage },


    methods: {
        ...mapActions(['refreshFilterRessources']),
        
        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.push({name:"Ressources", params: {projetListId: this.routeProjetListId}});
        },

        /**
         * Confirme le filtre des projets charger
         * envoi les données au store pour mettre a jour la variable projetsList
         */
        confirmFilter() {
            this.refreshFilterRessources(this.checkedRessourcesId);

            this.backPreviousRoute();  
        },

        /**
         * Verifie si l'id de la ressources existe dans filterRessources
         * si oui return true sinon false
         * @param {number} ressourceId l'id d'une ressource
         * 
         * @return {boolean}
         */
        isChecked(ressourceId) {
            let find = this.filterRessources.find(ressource => ressource == ressourceId);

            if (find) {
                return true;
            }

            return false;
        },

        /**
         * Initialise le tableau checkMetiersId avec les id deja existant dans filterMetier.
         */
        initCheckedRessourcesId() {
            this.checkedRessourcesId = [];

            this.filterRessources.forEach(ressource => {
                this.checkedRessourcesId.push(ressource);
            });
        }
    },

    mounted() {
        this.initCheckedRessourcesId();
    },
}
</script>