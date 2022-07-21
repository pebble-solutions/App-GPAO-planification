<template>
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

            <AppToolbarItem>
                <router-link :to="{name:'AjoutBesoins', params:{id : projet_id}}" custom v-slot="{navigate, href}">
                    <a class="btn btn-primary btn-block layer-full" :href="href" @click="navigate">
                        <i class="fa fa-plus"></i>
                        Métiers
                    </a>
                </router-link>
            </AppToolbarItem>
        </AppToolbar>

        <div class="row" v-if="projet">
            <CalendarTimeline :timeline="timeline" :projet="projet" :pointed-cells-obj="pointedCells" :is-ressources="true"/>
        </div>
    </div>

    <router-view :projet="projet" :timeline="timeline" @update-timeline="updateTimeline"></router-view>
    
</template>

<style lang="scss">
    .inputSelectionBesoins{
        width: 120px;
    }
</style>


<script>
import AppToolbar from "@/components/AppToolbar.vue";
import AppToolbarItem from "@/components/AppToolbarItem.vue";
import CalendarTimeline from "@/components/CalendarTimeline.vue";

import '@/js/date.js';

export default {
    inheritAttrs: false,

    props: {
        timeline: Object,
    },

    data() {
        return{
            pending: {
                ajoutGroup: false,
                projet: false,
                ressources_rh_type: false
            },
            projet: null,
            selectionBesoins: null,
            ressources_rh_type: null,
            pointedCells: {
                start: [0,0],
                end: [0,0]
            },
        }
    },

    computed: {
        /**
         * Get the projet id from url
         */
        projet_id() {
            return this.$route.params.id;
        }
    },

    components: {
        AppToolbar,
        AppToolbarItem,
        CalendarTimeline,
    },

    methods: {
        /**
         * Récupère le projet via l'api avec projet_id
         * Et affecter le résultat dans this.projet
         */
        getProjet() {
            let urlApi = `/projet/GET/${this.projet_id}/?api_hierarchy=1`;
            this.pending.projet = true;

            this.$app.apiGet(urlApi, {
                list_besoins_rh: true
            }).then( (data) => {
                this.projet = data;
                this.$emit('obj-projet', data);
            }).catch(this.$app.catchError);

            this.pending.projet = false;
        },

        /**
         * Prépare une requête pour un groupe de cellules sélectionnées. Calcule le point de pépart et le point 
         * d'arrivé, liste l'ensemble des métiers concernés, le jour de départ et le jour de fin.
         * La requête est préparée puis envoyée dans la méthode recordGroup()
         */
        addToSelection() {
            let startDay = this.pointedCells.start[1];
            let endDay = this.pointedCells.end[1];

            let startMetier = this.pointedCells.start[0];
            let endMetier = this.pointedCells.end[0];

            let compStart = this.$refs[`cell-${startMetier}-${startDay}`];
            let compEnd = this.$refs[`cell-${endMetier}-${endDay}`];

            let metiers_id = [];

            for (let i=startMetier; i <= endMetier; i++) {
                let compCur = this.$refs[`cell-${i}-${startDay}`];
                metiers_id.push(compCur[0].metier.id);
            }

            let query = {
                dd:compStart[0].jour.getSqlDate(),
                df:compEnd[0].jour.getSqlDate(),
                nb:this.selectionBesoins,
                projet_id:this.projet_id,
                projet__liaison_besoin_rh_id: metiers_id.join(','),
                days: '1,2,3,4,5,6,7'
            }

            this.recordGroup(query);
        },

        /**
         * recordGroup(props)
         * Enregistre les valeurs du formulaire de l'ajout groupé
         * 1. préparer les données qui seront envoyées en post
         *          - Créer la variable query avec toutes les données stockées au niveau de 'ressources_besoin_group'
         *          - Créer une chaine de caractère avec ressources_besoin_group.days qui liste uniquement les jours actifs (1,2,4...)
         * 2. injecter l'objet nouvellement créé dans MKGGet en POST via la clé query
         * 3. traiter le retour
         * 
         *  @param {String} query               les options a envoyer a l'api
         */
        recordGroup(query) {
            this.pending.ajoutGroup = true;

            let urlApi="/ressourcesBesoin/POST/group";

            this.$app.apiPost(urlApi, {
                query
            }).then((data) => {
                data.forEach(e => {
                    this.updatevalue(e);
                });

                this.pending.ajoutGroup = false;
                /** CLOSE MODAL $(#ajoutGroupModal).modal('hide') */
            }).catch(this.$app.catchError);
        },
        /**
         * Update timeline from modal with $emit
         * @param {Object} payload 
         */
        updateTimeline(payload) {
            for(let key in payload) {
                if(typeof payload[key] !== Date) {
                    this.tmpTimeline[key] = new Date(payload[key])
                } else {
                    this.tmpTimeline[key] = payload[key];
                }
            }

            this.$emit('update-timeline', this.timeline);
        }
    },

    mounted(){
        this.tmpTimeline = this.timeline;
        this.getProjet();
    }

}
</script>