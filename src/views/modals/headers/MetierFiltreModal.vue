<template>
    <AppModal 
        title="Ajouter un metier"
        class-Name="modal-dialog-scrollable"
        submit-label = "Valider"

        :pending="pending.metiersActifs" 
        :submit-btn="true" 
        :cancel-btn="true"

        @modal-hide="backPreviousRoute()"
        @submit="confirmFilter()"
    >
        <!-- <form method="post" @submit.prevent="searchMetiers()">
            <div class="input-group mb-3">
                <input type="text" placeholder="Rechercher un projet" class="form-control" v-model="search_metier.keyword"> 

                <button type="submit" class="btn btn-outline-secondary">
                    <i class="bi bi-search"></i>
                </button>
            </div>

            <AppSearch 
                :filter="true" 
                :action="action" 
                :search="search_projets" 
                @search="searchMetiers()"
                />
        </form>

        <AlertMessage v-if="projetsActifs.length == 0">
            Il n'y a aucun résultat à la recherche. Cette liste n'affiche que les projets en cours de production. Pour 
            afficher l'ensemble des projet, ouvrez le module Organisation ou Production.
        </AlertMessage>

        <div v-else class="list-group list-group-flush">
            <div v-for="projet in projetsActifs" :key="'projet-'+projet.id" class="list-group-item">       
                <div class="form-check text-nowrap">
                    <input type="checkbox" class="form-check-input" :id="'ckb-projet-'+projet.id" :value="projet.id" v-model="checkedProjetsId" :checked="isChecked(projet.id)">
                    <label class="form-check-label" :for="'ckb-projet-'+projet.id">
                        <h6>{{projet.intitule}}</h6>
                    </label>
                </div>
                <div class="form-check text-nowrap">
                    <div class="text-secondary"><i class="bi bi-calendar-fill"></i> {{projet.ddp}} <i class="bi bi-chevron-right"></i> {{projet.dfp}}</div>
                </div>
            </div>
        </div> -->
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
// import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';

import { mapActions, mapState } from 'vuex';
// import AppSearch from '../../../components/pebble-ui/AppSearch.vue';

export default {
    data() {
        return {
            pending: {
                metierActifs: false
            },
            search_metier: {
                keyword: ''
            },
            checkedMetiersId: [],
            routeMetierListId: null
        }
    },

    computed: {
        ...mapState(['timeline', 'projetsActifs', 'projetsList'])
    },

    watch: {
        projetsActifs() {
            if (this.projetsActifs.length > 0) {
                this.pending.projetsActifs = true
            }
        }
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeProjetListId = from.params.projetListId;
        })
    },  

    components: { AppModal },


    methods: {
        ...mapActions(['refreshProjetsList']),
        
        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.push({name:"Ressources", params: {projetListId: this.routeProjetListId}});
        },

        /**
         * Charge la page avec le tableau pour affecter les besoins sur les projets sélectionnée
         */
        loadRessourcesProjetRoute() {
            let sProjetListId = ''

            this.projetsList.forEach(projet => {
                if ('' === sProjetListId) {
                    sProjetListId += projet.id; 
                } else {
                    sProjetListId += ',' + projet.id;
                }
            });

            this.$router.push({name:"Ressources", params: {projetListId: sProjetListId}})
        },

        /**
         * Confirme le filtre des projets charger
         * envoi les données au store pour mettre a jour la variable projetsList
         */
        confirmFilter() {
            this.refreshProjetsList(this.checkedProjetsId);

            if (this.projetsList.length > 0) {
                this.loadRessourcesProjetRoute();
            } else {
                this.backPreviousRoute();
            }
        },

        /**
         * Verifie si l'id du projet existe dans projetsList
         * si oui return true sinon false
         * @param {number} projetId l'id d'un projet
         */
        isChecked(projetId) {
            let find = this.projetsList.find(projet => projet.id == projetId);

            if (find) {
                return true;
            }

            return false;
        },

        /**
         * Initialise le tableau checkProjetsId avec les id deja existant dans projetsList.
         */
        initCheckedProjetsId() {
            this.projetsList.forEach(projet => {
                let find = this.checkedProjetsId.find(projetId => projetId == projet.id);

                if (!find) {
                    this.checkedProjetsId.push(projet.id);
                }
            });
        }
    },

    mounted() {
        this.initCheckedProjetsId();
    },
}
</script>