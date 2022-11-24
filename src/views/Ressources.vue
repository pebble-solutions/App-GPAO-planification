<template>
    <div>
        <div class="col overflow-auto" v-if="projet_id">
            <AppToolbar class-list="position-sticky" style-list="left:0px; right:0px; z-index:500;" id="main">
                <AppToolbarItem class-list="border-right me-2">
                    <form class="form-inline" @submit.prevent="addToSelection">
                        <label for="selectionBesoins" class="mx-1">Pour la selection :</label>
                        <input  type="number" id="selectionBesoins" class="mx-1 form-control inputSelectionBesoins" name="selectionBesoins" v-model="selectionBesoins">
                        <button class="mx-1 btn btn-outline-secondary" :disabled="pending.ajoutGroup">
                            <span v-if="pending.ajoutGroup" class="spinner-border spinner-border-sm"  role="status"></span>
                            <i class="bi bi-check" v-else></i>
                        </button>
                    </form>
                </AppToolbarItem>
        
                <AppToolbarItem >
                    <router-link :to="{name:'AjoutGroup', params:{id : projet_id}}" custom v-slot="{navigate, href}">
                        <a :href="href" @click="navigate" class="btn btn-outline-secondary ms-2">
                            Ajout groupé
                        </a>
                    </router-link>
                </AppToolbarItem>
    
                <AppToolbarItem class-list="ms-2">
                    <router-link :to="{name:'AjoutBesoins', params:{id : projet_id}}" custom v-slot="{navigate, href}">
                        <a class="btn btn-primary btn-block layer-full" :href="href" @click="navigate">
                            <i class="fa fa-plus"></i>
                            Métiers
                        </a>
                    </router-link>
                </AppToolbarItem>
            </AppToolbar>
            <!-- <HeaderToolbar>
                <form class="form-inline " @submit.prevent="addToSelection">
                    <label for="selectionBesoins" class="mx-1">Pour la selection :</label>
                    <input  type="number" id="selectionBesoins" class="mx-1 form-control inputSelectionBesoins" name="selectionBesoins" v-model="selectionBesoins">
                    <button class="mx-1 btn btn-outline-secondary" :disabled="pending.ajoutGroup">
                        <span v-if="pending.ajoutGroup" class="spinner-border spinner-border-sm"  role="status"></span>
                        <i class="bi bi-check" v-else></i>
                    </button>
                </form>
    
                <router-link :to="{name:'AjoutGroup', params:{id : projet_id}}" custom v-slot="{navigate, href}">
                    <a :href="href" @click="navigate" class="btn btn-outline-secondary ms-2">
                        Ajout groupé
                    </a>
                </router-link>
    
                <router-link :to="{name:'AjoutBesoins', params:{id : projet_id}}" custom v-slot="{navigate, href}">
                    <a class="btn btn-primary btn-block layer-full" :href="href" @click="navigate">
                        <i class="fa fa-plus"></i>
                        Métiers
                    </a>
                </router-link>
            </HeaderToolbar> -->
    
            <div class="row" v-if="projetsList">
                <CalendarTimeline ref="CalendarTimeline" :timeline="timeline" :pointed-cells-obj="pointedCells" :is-ressources="true"/>
            </div>
        </div>

        <div v-else class="py-3 lead text-secondary text-center">
            <div>
                <i class="bi bi-file-x"></i>
            </div>

            <div>Pas de projet séléctionné</div>
        </div>

        <router-view></router-view>
    </div>
</template>

<style lang="scss">
    .inputSelectionBesoins {
        width: 120px;
    }
</style>


<script>
import AppToolbar from "@/components/AppToolbar.vue";
import AppToolbarItem from "@/components/AppToolbarItem.vue";
import CalendarTimeline from "@/components/CalendarTimeline.vue";
//import AlertMessage from "@/components/pebble-ui/AlertMessage.vue";
//import HeaderToolbar from "@/components/pebble-ui/toolbar/HeaderToolbar.vue";

import '@/js/date.js';
import { mapActions, mapState } from 'vuex';

export default {
    inheritAttrs: false,

    data() {
        return{
            pending: {
                ajoutGroup: false,
                projet: false,
                ressources_rh_type: false
            },
            selectionBesoins: null,
            ressources_rh_type: null,
            pointedCells: {
                start: [0,0],
                end: [0,0]
            },
        }
    },

    computed: {
        ...mapState(['selectedCells', 'projetsList', 'ressourcesBesoin', 'timeline']),

        /**
         * Get the projet id from url
         */
        projet_id() {
            return this.$route.params.projetListId;
        }
    },

    components: {CalendarTimeline, AppToolbar, AppToolbarItem},

    methods: {
        ...mapActions(['refreshProjet', 'refreshRessourcesBesoin']),
        
        /**
         * Récupère le projet via l'api avec projet_id 
         * et l'enregistre dans le store
         */
        getProjet() {
            this.pending.projet = true;

            let urlApi = `/projet/GET/${this.projet_id}/?api_hierarchy=1`;

            this.$app.apiGet(urlApi, {
                list_besoins_rh: true
            }).then( (data) => {
                this.refreshProjet(data);
                this.getRessourcesBesoin();
            }).catch(this.$app.catchError);

            this.pending.projet = false;
        },

        /**
         * Prépare une requête pour un groupe de cellules sélectionnées. Calcule le point de départ et le point d'arrivé,
         * liste l'ensemble des métiers concernés, le jour de départ et le jour de fin.
         * La requête est préparée puis envoyée dans la méthode recordGroup()
         */
        addToSelection() {
            let metiers_id = [];
            let oSize = Object.keys(this.selectedCells).length;
            let count = 1;
            let compStart = {};
            let compEnd = {};

            for (let cell in this.selectedCells) {
                if ( 1 == count) {
                    compStart = this.selectedCells[cell][0];
                }

                if (oSize == count) {
                    compEnd = this.selectedCells[cell][0];
                }

                let exist = metiers_id.find(id => id == this.selectedCells[cell][0].metier.id)

                if (!exist) {
                    metiers_id.push(this.selectedCells[cell][0].metier.id);
                }

                count++;
            }

            let query = {
                dd:compStart.jour.getSqlDate(),
                df:compEnd.jour.getSqlDate(),
                nb:this.selectionBesoins,
                projet_id:this.projet_id,
                projet__liaison_besoin_rh_id: metiers_id.join(','),
                days: '1,2,3,4,5,6,7'
            }

            this.recordGroup(query);
        },

        /**
         * Enregistre les valeurs du formulaire de l'ajout groupé des ressourcesBesoin et les enregistre dans le store
         * 1. injecter l'objet nouvellement créé en POST via la clé query
         * 2. traiter le retour
         * 
         * @param {Object} query               les options a envoyer a l'api
         * 
         * @return {Promise}
         */
        recordGroup(query) {
            this.pending.ajoutGroup = true;

            let newRessourcesBesoin = [];
            let urlApi = "/ressourcesBesoin/POST/group";

            this.$app.apiPost(urlApi, 
                query
            ).then((data) => {
                newRessourcesBesoin['action'] = 'update'
                newRessourcesBesoin['data'] = data

                this.refreshRessourcesBesoin(newRessourcesBesoin);

                this.pending.ajoutGroup = false;
            }).catch(this.$app.catchError);
        },

        /**
         * Récupère via l'api mes ressources besoins du projet et les enregistre dans le store
         */
         getRessourcesBesoin() {
            let newRessourcesBesoin = [];

            let urlApi = '/ressourcesBesoin/GET/list'

            this.$app.apiGet(urlApi, {
                projet_id: this.projet_id
            }).then((data) => {
                newRessourcesBesoin['data'] = data;
                this.refreshRessourcesBesoin(newRessourcesBesoin);
            }).catch(this.$app.catchError);
        },
    },

}
</script>