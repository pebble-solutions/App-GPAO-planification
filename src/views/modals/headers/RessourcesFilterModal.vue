<template>
    <AppModal 
        title="Ajouter une Ressource"
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

        <AlertMessage v-if="ressourcesRHTypeData.length == 0">
            Il n'y a aucun résultat à la recherche. Cette liste n'affiche que les ressources créer. Pour 
            créer des ressources, ouvrez le module ressources.
        </AlertMessage>
        

        <div v-else class="list-group list-group-flush">
            <!-- <div v-for="ressource in ressourcesRHTypeData" :key="'ressource-'+ressource.id" class="list-group-item">       
                <div class="form-check text-nowrap">
                    <input type="checkbox" class="form-check-input" :id="'ckb-ressource-'+ressource.id" :value="ressource.id" v-model="checkedRessourcesId" :aria-label="ressource.nom" name="checkedRessourcesId[]">
                    <label class="form-check-label" :for="'ckb-ressource-'+ressource.id">
                        <h6>{{ressource.nom}}</h6>
                    </label>
                </div>
            </div> -->

            <RessourcesFilterModalItem v-for="ressource in ressourcesRHTypeData" :key="'ressource-'+ressource.id" :ressource="ressource" :ischecked="isChecked(ressource.id)" @update-checked="updateCheckedRessourcesId"/>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';

import { mapActions, mapState } from 'vuex';
import RessourcesFilterModalItem from '../../../components/headers/RessourcesFilterModalItem.vue';

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
        }
    },

    computed: {
        ...mapState(['timeline', 'RessourcesRHType']),

        ressourcesRHTypeData() {
            return this.RessourcesRHType['ressourcesRHType'];
        },
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeProjetListId = from.params.projetListId;
        })
    },  

    components: { AppModal, AlertMessage, RessourcesFilterModalItem },


    methods: {
        ...mapActions('RessourcesRHType', ['refreshRessourcesRHTypeChecked']),
        /**
         * back the url route before the modal open
         */
        backPreviousRoute() {
            this.$router.go(-1);
        },

        isChecked(ressourceId) {
            console.log(this.checkedRessourcesId);
            let foundChecked = this.checkedRessourcesId.find(id => id == ressourceId);

            return foundChecked ? true : false;
        },

        updateCheckedRessourcesId(payload) {
            let foundId = this.checkedRessourcesId.findIndex(id => id == payload);

            if(-1 !== foundId) {
                this.checkedRessourcesId.splice(foundId, 1);
            } else {
                this.checkedRessourcesId.push(payload);
            }
        },

        /**
         * Confirme le filtre des projets charger
         * envoi les données au store pour mettre a jour la variable projetsList
         */
        confirmFilter() {
            this.refreshRessourcesRHTypeChecked(this.checkedRessourcesId);

            this.backPreviousRoute();  
        },

        /**
         * Charge la collection ressourcesRHType dans une varaible du component
         */
        async loadRessourcesRhType() {
            this.ressourcesRHType = this.$assets.getCollection('ressourcesRHType');
            await this.ressourcesRHType.load();
        },

        loadCheckedRessourcesId() {
            console.log('beforeload', this.RessourcesRHType);
            this.checkedRessourcesId = this.RessourcesRHType['ressourcesRHTypeChecked'];
            console.log('afterload', this.checkedRessourcesId);
        },
    },

    async beforeMount() {
        this.loadCheckedRessourcesId();
        await this.loadRessourcesRhType();
    },
}
</script>