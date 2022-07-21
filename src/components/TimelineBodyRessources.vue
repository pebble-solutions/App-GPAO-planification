<template>
    <tbody v-if="ressources_besoin">
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
                    :projet_id="projet.id"
                    :selected="selectedCell(i, j)"

                    :ref="'cell-'+i+'-'+j"

                    @recorded="updatevalue"
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
        // background-image: linear-gradient(to right, #FFD2C1 0%, #FAE8DA 100%);
        background: #d9a7c7;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to left, #fffcdc, #d9a7c7);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to left, #fffcdc, #d9a7c7); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        text-align: center;
    }
    .planning-periode-case-icon-A {
        // background-color: #ef5734;
        // background-image: linear-gradient(315deg, #ef5734 0%, #ffcc2f 74%);
        background: #fceabb;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #f8b500, #fceabb);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #f8b500, #fceabb); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        text-align: center;
    }
    .planning-periode-case-icon-J {
        // background-color: #ffd99c;
        // background-image: linear-gradient(315deg, #ffc15e 0%, #ffd99c 74%);
        background: #ede574; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #ede574, #e1f5c4); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #ede574, #e1f5c4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        text-align: center;
    }
    .planning-periode-case-icon-N {
        // background-color: #7f5a83;
        // background-image: linear-gradient(315deg, #7f5a83 0%, #0d324d 74%);
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

export default {
    props: {
        projet: Object,
        pointedCellsObj: Object,
        timeline: Object,
    },

    data() {
        return {
            perDict: {
                "A": "Apres-midi",
                "N": "Nuit",
                "J": "Jour",
                "M": "Matin"
            },
            ressources_besoin: [],
            pointingCells: false,
        }
    },

    computed: {
        pointedCells() {
            return this.pointedCellsObj;
        },


        /**
         * Retourne la liste des dates (objet Date) start et end.
         * @returns {Array}
         */
        daysList() {
            return Date.listDays(this.timeline.start, this.timeline.end);
        },

    },

    components: {
        Cell
    },

    methods: {
        /**
         * Permet d'ajouter des classes avec des variable en chaine de text et la renvoi
         * @param   {Object}   metier   L'objet BesoinRH
         * 
         * @returns {Varchar}   
         */
        classNameBgCell(metier){
            let className = 'planning-periode-case-icon-' + metier.periode_code;

            return className;
        },

        /**
         * Retourne le nombre de ressources nécessaires enregistrée sur une date un un métier.
         * @param {Object} metier L'objet BesoinRH
         * @param {Date} jour Le jour à vérifier
         * 
         * @returns {Integer}
         */
        getBesoinNb(metier, jour) {
            let besoin = this.ressources_besoin.find(e => e.dd == jour.getSqlDate() && e.projet__liaison_besoin_rh_id == metier.id);

            let val = 0;

            if (besoin) {
                val = besoin.nb;
            }

            return val;
        },

        updatevalue(data){
            let found = this.ressources_besoin.find(e => e.id == data.id);
            if  (found) {
                for (let key in data) {
                    found[key] = data[key];
                }
            }
            else {
                this.ressources_besoin.push(data);
            }
        },

        /**
         * Retourne true si la cellule fait partie des coordonnées de sélection
         * @param {Integer} i Ligne de métier
         * @param {Integer} j Ligne de jour
         * @returns {Boolean}
         */
        selectedCell(i, j) {
            if (i >= this.pointedCells.start[0] && i <= this.pointedCells.end[0]) {
                if (j >= this.pointedCells.start[1] && j <= this.pointedCells.end[1]) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Déclenche la sélection d'un groupe de cellules
         * @param {Integer} i Ligne de métier
         * @param {Integer} j  Ligne de jour
         */
        pointCellStart(i,j) {
            this.pointedCells.end = [0, 0];
            this.pointedCells.start = [i, j];
            this.pointingCells = true;
        },

        /**
         * Appelé à la fin de la sélection d'un groupe de cellules (lorsque le bouton de sourie est relachée)
         * @param {Integer} i Ligne de métier
         * @param {Integer} j Ligne de jour
         */
        pointCellEnd(i,j) {
            this.pointedCells.end = [i, j];
            this.pointingCells = false;
        },

        /**
         * Appelé pour incrémenter la sélection de cellucles pendant le drag
         * @param {Integer} i Ligne de métier
         * @param {Integer} j Ligne de jour
         */
        pointCellOver(i,j) {
            if (this.pointingCells) {
                this.pointedCells.end = [i,j];
            }
        },

        /**
         * Récupère via l'api mes ressources besoins du projet
         */
        getRessourcesBesoin() {
            let urlApi = '/ressourcesBesoin/GET/list'

            this.$app.apiGet(urlApi, {
                projet_id: this.projet.id
            }).then((data) => {
                this.ressources_besoin = data;
            }).catch(this.$app.catchError);
        },

    },

    mounted() {
        this.getRessourcesBesoin();

    }
}
</script>