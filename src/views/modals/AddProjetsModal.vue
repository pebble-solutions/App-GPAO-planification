<template>
    <AppModal 
        title="Ajouter un projet"
        class-Name="modal-dialog-scrollable"
        submit-label = "Valider"

        :pending="pending.projects" 
        :submit-btn="true" 
        :cancel-btn="true"

        @modal-hide="backPreviousRoute()"
        @submit="confirmFilter()">
        <form method="post" @submit.prevent="searchProjets()">
            <div class="input-group mb-3">
                <input type="text" placeholder="Rechercher un projet" class="form-control" v-model="search_projets.keyword"> 

                <button type="submit" class="btn btn-outline-secondary">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </form>

        <Spinner v-if="pending.searchProjets"></Spinner>

        <AlertMessage v-else-if="list_projets.length == 0">
            Il n'y a aucun résultat à la recherche. Cette liste n'affiche que les projets en cours de production. Pour 
            afficher l'ensemble des projet, ouvrez le module Organisation ou Production.
        </AlertMessage>

        <div class="list-group list-group-flush" v-else>
            <button type="button" class="list-group-item list-group-item-action d-flex align-items-center" @click.prevent="toggleSelection(projet)" v-for="projet in list_projets" :key="'modal-projet-' + projet.id" :id="'liste-ligne-' + projet.id">
                <div style="width: 36px;min-width:36px;">
                    <i class="bi bi-check text-muted" v-if="projets_remove.find(e => e.id == projet.id)" title="Sera retiré de la vue"></i>
                    <i class="bi bi-check text-warning" v-else-if="projets_add.find(e => e.id == projet.id)" title="Sera ajouté à la vue"></i>
                    <i class="bi bi-check text-success" v-else-if="projets_id.find(e => e == projet.id)" title="Déjà chargé"></i>
                </div>
                <div>
                    {{projet.intitule}}
                    <div class="text-secondary"><i class="fas fa-calendar"></i> {{projet.ddp}} <i class="fas fa-chevron-right"></i> {{projet.dfp}}</div>
                </div>
            </button>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
import Spinner from '../../components/pebble-ui/Spinner.vue';
import AlertMessage from '../../components/pebble-ui/AlertMessage.vue';

export default {
    props: {
        projetList: Array,
        timeline: Object,
    },

    data() {
        return {
            pending: {
                projects: false,
                searchProjets: false
            },
            search_projets: {
                keyword: ''
            },
            list_projets: [],
            projets_add: [],
            projets_remove: [],
        }
    },

    components: {
        AppModal,
        Spinner,
        AlertMessage
    },

    computed: {
        projets_id() {
            if(this.projet_id) {
                return this.projet_id.split(',');
            }
            return [];
        },
    },

    methods: {
        /**
         * Lance une recherche sur l'API des projets, stock le résulta dans le tableau list_projets
         */
        searchProjets() {
            this.pending.searchProjets = true;

            let urlApi = "/projet/GET/list";

            this.$app.apiPost(urlApi, {
                in_production: this.timeline.start.getSqlDate(),
                q: this.search_projets.keyword,
                orderby: ["ddp","dfp","intitule"]
            }).then((data) => {
                this.list_projets = data;

                console.log('result', this.list_projets);

                this.pending.searchProjets = false;
            }).catch(this.$app.catchError);
        },

        /**
         * Prépare la modification de la sélection de metier. Crée un tableau metiers_add et un tableau metiers_remove
         * @param {Object} obj 
         * @param {String} filterName 
         */
        toggleSelection(obj) {
            let i_rm = this.projets_remove.findIndex(e => e.id == obj.id);
            let i_add = this.projets_add.findIndex(e => e.id == obj.id);
            /**VOIR POUR USE GUARD CLAUSE */
            if (this.projets_id.find(e => e == obj.id)) {
                if (i_rm === -1) {
                    this.projets_remove.push(obj);

                    if (i_add !== -1) {
                        this.projets_add.splice(i_add, 1);
                    }
                }
                else {
                    this.projets_remove.splice(i_rm, 1);
                }
            }
            else {
                if (i_add === -1) {
                    this.projets_add.push(obj);

                    if (i_rm !== -1) {
                        this.projets_remove.splice(i_rm, 1);
                    }
                }
                else {
                    this.projets_add.splice(i_add, 1);
                }
            }
        },

        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.push({name:"Affectations"});
        },

        /**
         * Valide la sélection du filtre et charge la nouvelle liste en fusionnant ..._remove et 
         * ..._add sur ..._id. Lance la recherche.
         */
        confirmFilter() {
            let ids = this.projet_id.split(',');

            this.projets_remove.forEach((obj) => {
                let i = ids.findIndex(e => e == obj.id);

                if(i !== -1) {
                    ids.splice(i, 1);
                }
            });

            this.projets_add.forEach((obj) => {
                let i =ids.findIndex(e => e == obj.id);

                if(i === -1) {
                    ids.push(obj.id);
                }
            });

            this.projets_remove = [];
            this.projets_add = [];

            this.projet_id = ids.join(',');
            
            this.filterOptions();
        },

        filterOptions(){
            let newIds=[];
            let escapeApi = false;
            let ids = this.projet_id.split(',');
            let query = {
                list_besoins_rh : true
            };

            let datas = this.list_projets;

            ids.forEach((fid) => {
                if(!datas.find(e => e.id == fid) && fid != ""){
                    newIds.push(fid);
                }
            });

            let removeIds = [];

            datas.forEach((e) => {
                let found = ids.find(id => id == e.id);

                if(!found) {
                    removeIds.push(e.id);
                }
            });

            removeIds.forEach((id) => {
                let i = datas.findIndex(e => e.id == id);

                datas.splice(i,1);
            });

            this.list_projets = datas;

            if(removeIds.length > 0 && newIds.length == 0) {
                escapeApi = true;
            } else {
                query.id = newIds;
                query.id_query = "and";
            }

            if(!escapeApi) {
                console.log('api');
                // MKGGet.queue.push({
                //     url: '/api/projet/GET/list/',
                //     query: query,
                //     self:this,
                //     callback(resp, self) {
                //         if (resp.status === 'OK') {
                //             resp.data.forEach((p) => {
                //                 self.projets.push(p);
                //             });

                //             APP.closeAllModals();
                //         }
                //         else {
                //             alert('Erreur : '+resp.message);
                //             console.error(resp);
                //         }
                //         self.pending.projets = false;
                //     }
                // });
            }
        }
    },

    mounted() {
        this.searchProjets();
    }
}
</script>