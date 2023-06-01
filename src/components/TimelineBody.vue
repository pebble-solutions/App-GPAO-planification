<template>
    <tbody class="bg-white" v-for="projet in projectFilterWithFilterRessources" :key="'projet-'+projet.id">
        <tr class="table-secondary"> <!--Mettre le tr dans un component-->
            <th :colspan="daysList.length + 1">
                <div div class="d-flex justify-content-start align-items-center">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" :id="'switchShowProjet-'+projet.id" checked/>
                        <label class="form-check-label" :for="'switchShowProjet-'+projet.id" >{{projet.intitule}}</label>

                        <span></span> 
                    </div>

                    <div class="ms-3 text-secondary">
                        <i class="bi bi-calendar me-1"></i>
                        <a href="#?" class="text-decoration-none text-secondary" @click="filterTimeline('ddp', projet.ddp)">{{projet.ddp}}</a> 
                        <i class="bi bi-chevron-compact-right"></i>
                        <a href="#?" class="text-decoration-none text-secondary" @click="filterTimeline('dfp', projet.dfp)">{{projet.dfp}}</a>
                    </div>
    
                    <a href="" class="btn btn-outline-primary ms-3 sticky_metier sticky6_metier_title" target="_blank" v-if="!page.ressources">
                        Définir les besoins
                    </a>

                    <router-link :to="{name:'AjoutBesoins', params: {id: projet.id}}" custom v-slot="{navigate, href}" v-if="page.ressources">
                        <a class="btn btn-primary btn-block layer-full fs-6 ms-3" :href="href" @click="navigate">
                            <i class="bi bi-plus-lg"></i>
                            Ressources
                        </a>
                    </router-link>

                    <router-link :to="{name:'ConfigHeures', params: {id: projet.id}}" custom v-slot="{navigate, href}" v-if="page.ressources">
                        <a class="btn btn-secondary btn-block layer-full ms-3" :href="href" @click="navigate">
                            <i class="bi bi-clock"></i>
                            Heures de travail
                        </a>
                    </router-link>
                </div>
            </th>
        </tr>

        <template v-if="ressourcesToShow(projet)">
            <tr v-for="(metier, i) in ressourcesToShow(projet)" :key="'projet-'+projet.id+'_metier-'+i">
                <th class="text-left px-2 rowCalendar" :class="classNameBgCell(metier)">
                    <div class="d-flex justify-content-between align-items-center">
                        <span :title="metier.oType.nom">
                            {{metier.oType.nom.cutText(15)}}
                        </span>

                        <em>{{perDict[metier.periode_code]}}</em>
                    </div>
                </th>

                <td v-for="(jour, j) in daysList" :key="'projet-'+projet.id+'_jour-'+j"
                    class="text-right planning-cell"
                    :class="{'border-end border-4': jour.getDay() === 0}"
                >
                    <Cell :value="getBesoinNb(metier, jour)" 
                        :i="i"
                        :j="j"
                        :metier="metier"
                        :jour="jour"
                        :selected="selectedPointedCell(i, j, projet.id)"
                        :projet_id="projet.id"

                        :ref="'cell-'+i+'-'+j+'-'+projet.id"

                        @point-cell-start="pointCellStart(i, j, projet.id)"
                        @point-cell-end="pointCellEnd(i, j, projet.id)"
                        @point-cell-over="pointCellOver(i, j, projet.id)"
                    ></Cell>

                </td>
            </tr>
        </template>

        <template v-else>
            <tr>
                <td colspan="30"> toto</td>
            </tr>
        </template>
    </tbody>
</template>

<style lang="scss" scoped>
.rowCalendar {
    min-width: 250px;
}
.planning-periode-case-icon-M {
        background: #d9a7c7;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to left, #fffcdc, #d9a7c7);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to left, #fffcdc, #d9a7c7); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        text-align: center;
    }

    .planning-periode-case-icon-A {
        background: #fceabb;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #f8b500, #fceabb);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #f8b500, #fceabb); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        text-align: center;
    }

    .planning-periode-case-icon-J {
        background: #ede574; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #ede574, #e1f5c4); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #ede574, #e1f5c4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        text-align: center;
    }

    .planning-periode-case-icon-N {
        background: #000428;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #004e92, #000428);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #004e92, #000428); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        color: white!important;
        text-align: center;
    }

    .planning-cell {
		min-width:50px;
		position:relative;
	}
</style>

<script>
import { mapActions, mapState } from 'vuex';
import '@/js/text.js';
import '@/js/date.js';

import Cell from '@/components/Cell.vue';
import { listIntervalDays } from '../js/date';

export default {
    data() {
        return {
            perDict: {
                "A": "Apres-midi",
                "N": "Nuit",
                "J": "Jour",
                "M": "Matin"
            },
            pointingCells: false,
            pointedCells: {
                start: [0, 0, 0],
                end: [0, 0, 0]
            }
        }
    },

    computed: {
        ...mapState(['projetsList', 'timeline', 'selectedCells', 'ressourcesBesoin', 'page', 'filterRessources']),

        /**
         * Retourne la liste des dates (objet Date) start et end.
         * 
         * @returns {Array}
         */
        daysList() {
            return listIntervalDays(this.timeline.start, this.timeline.end);
        },

        /**
         * Filtre la liste des projets pour ne returner que les projets qui on des ressources qui ce trouve dans filterRessources
         * si filterRessources est vide renvoi projetList (pas de filtre effectué)
         * 
         * @return {Array} 
         */
        projectFilterWithFilterRessources() {
            //if (this.filterRessources.length == 0 ) {
                return this.projetsList;
            //}

            // let projetToShow = [];

            // this.projetsList.forEach(projet => {
            //     let find;

            //     this.filterRessources.forEach(ressourceId => {
            //         find = projet.besoins_rh.find(besoin => besoin.oType.id == ressourceId);
            //     });

            //     if (find) {
            //         projetToShow.push(projet);
            //     }
            // });

            // return projetToShow;
        },


    },

    components: {Cell},

    methods: {
        ...mapActions(['refreshSelectedCells','refreshRessourcesBesoin']),

        /**
         * Filtre les ressources a affichées en fonction de filterRessources
         * @param {Object}      projet
         * 
         * @return {Array} 
         */
         ressourcesToShow(projet) {
            if (this.filterRessources.length == 0) {
                return projet.besoins_rh;
            }
            
            let newBesoinsRhFilter = [];

            let besoins_rh = projet.besoins_rh;

            newBesoinsRhFilter = besoins_rh.filter(besoin => this.filterRessources.includes(besoin.oType.id));

            return newBesoinsRhFilter;
        },
        
        /**
         * Permet d'ajouter des classes avec des variable en chaine de text et la renvoi
         * 
         * @param   {Object}   metier   L'objet BesoinRH
         * 
         * @returns {string}   
         */
         classNameBgCell(metier) {
            let className = 'planning-periode-case-icon-' + metier.periode_code;

            return className;
        },

        /**
         * Retourne le nombre de ressources nécessaires enregistrée sur une date un un métier.
         * 
         * @param {Object} metier L'objet BesoinRH
         * @param {date} jour Le jour à vérifier
         * 
         * @returns {number}
         */
         getBesoinNb(metier, jour) {
            let besoin = this.ressourcesBesoin.find(e => e.dd == jour.getSqlDate() && e.projet__liaison_besoin_rh_id == metier.id);

            let val = 0;

            if (besoin) {
                val = besoin.nb;
            }

            return val;
        },

        /**
         * Retourne true si la cellule fait partie des coordonnées de sélection et l'ajout dans le store, si false la retire du store
         * 
         * @param {number} i Ligne de métier
         * @param {number} j Ligne de jour
         * 
         * @returns {boolean}
         */
         selectedPointedCell(i, j, pId) {
            if (i >= this.pointedCells.start[0] && i <= this.pointedCells.end[0]) {
                if (j >= this.pointedCells.start[1] && j <= this.pointedCells.end[1]) {
                    if (pId == this.pointedCells.start[2]) {
                        return true;
                    }
                }
            }

            return false;
        },

        /**
         * Déclenche la sélection d'un groupe de cellules
         * 
         * @param {number} i Ligne de métier
         * @param {number} j  Ligne de jour
         * @param {number} pId L'id du projet
         */
         pointCellStart(i,j, pId) {
            this.pointedCells.end = [0, 0, pId];
            this.pointedCells.start = [i, j, pId];

            this.pointingCells = true;
        },

        /**
         * Appelé à la fin de la sélection d'un groupe de cellules (lorsque le bouton de sourie est relachée)
         * 
         * @param {number} i Ligne de métier
         * @param {number} j Ligne de jour
         * @param {number} pId l'id du projet
         */
         pointCellEnd(i,j, pId) {
            this.pointedCells.end = [i, j, pId];

            let listCell = {};
            
            for (let metier = this.pointedCells.start[0]; metier <= this.pointedCells.end[0]; metier++) {
                for (let jour = this.pointedCells.start[1]; jour <= this.pointedCells.end[1]; jour++) {
                    listCell['cell-'+metier+'-'+jour+'-'+pId] = this.$refs['cell-'+metier+'-'+jour+'-'+pId];
                }
            }

            this.refreshSelectedCells(listCell);
            this.pointingCells = false;
        },

        /**
         * Appelé pour incrémenter la sélection de cellucles pendant le drag
         * 
         * @param {number} i Ligne de métier
         * @param {number} j Ligne de jour
         * @param {number} pId l'id du projet
         */
        pointCellOver(i,j,pId) {
            if (this.pointingCells) {
                this.pointedCells.end = [i,j,pId];
            }
        },
    }
}
</script>

