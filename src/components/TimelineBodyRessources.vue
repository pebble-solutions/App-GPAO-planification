<template>
    <tbody v-if="projet && ressourcesBesoin">
        <tr v-for="(metier, i) in projet.besoins_rh" :key="'besoinsRh-'+ i">
            <th class="text-left rowCalendar" :class="classNameBgCell(metier)">
                <div class="d-flex justify-content-between align-items-center">
                    <span :title="metier.oType.nom">{{metier.oType.nom.cutText(15)}}</span>

                    <em>{{perDict[metier.periode_code]}}</em>
                </div>
            </th>

            <td v-for="(jour, j) in daysList" 
                :key="'jour-'+j" 
                
                class="text-right planning-cell" 
                :class="{'border-end border-4': jour.getDay() === 0}"

                :title="jour.getSqlDate()"
            >
                <Cell :value="getBesoinNb(metier, jour)" 
                    :i="i"
                    :j="j"
                    :metier="metier"
                    :jour="jour"
                    :selected="selectedPointedCell(i, j)"

                    :ref="'cell-'+i+'-'+j"

                    @point-cell-start="pointCellStart(i, j)"
                    @point-cell-end="pointCellEnd(i, j)"
                    @point-cell-over="pointCellOver(i, j)"
                ></Cell>
            </td>
        </tr>
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
import Cell from '@/components/Cell.vue';

import '@/js/date.js';
import '@/js/text.js';
import { mapActions, mapState } from 'vuex';

export default {
    props: {
        pointedCellsObj: Object,
    },

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
                start: [0, 0],
                end: [0, 0]
            }
        }
    },

    computed: {
        ...mapState(['selectedCells', 'projet', 'ressourcesBesoin', 'timeline']),

        /**
         * Retourne la liste des dates (objet Date) start et end.
         * 
         * @returns {Array}
         */
        daysList() {
            return Date.listDays(this.timeline.start, this.timeline.end);
        }
    },

    components: {Cell},

    methods: {
        ...mapActions(['refreshSelectedCells','refreshRessourcesBesoin']),
        
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
        selectedPointedCell(i, j) {
            if (i >= this.pointedCells.start[0] && i <= this.pointedCells.end[0]) {
                if (j >= this.pointedCells.start[1] && j <= this.pointedCells.end[1]) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Déclenche la sélection d'un groupe de cellules
         * 
         * @param {number} i Ligne de métier
         * @param {number} j  Ligne de jour
         */
        pointCellStart(i,j) {
            this.pointedCells.end = [0, 0];
            this.pointedCells.start = [i, j];

            this.pointingCells = true;
        },

        /**
         * Appelé à la fin de la sélection d'un groupe de cellules (lorsque le bouton de sourie est relachée)
         * 
         * @param {number} i Ligne de métier
         * @param {number} j Ligne de jour
         */
        pointCellEnd(i,j) {
            this.pointedCells.end = [i, j];

            let listCell = {};
            
            for (let metier = this.pointedCells.start[0]; metier <= this.pointedCells.end[0]; metier++) {
                for (let jour = this.pointedCells.start[1]; jour <= this.pointedCells.end[1]; jour++) {
                    listCell['cell-'+metier+'-'+jour] = this.$refs['cell-'+metier+'-'+jour];
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
         */
        pointCellOver(i,j) {
            if (this.pointingCells) {
                this.pointedCells.end = [i,j];
            }
        },
    },
}
</script>