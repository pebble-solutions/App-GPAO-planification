<template>
    <div class="planning-cell-comp">
        <div v-if="edit" class="w-100 h-100">
            <input ref="valueinput" type="number" v-model="activevalue" @keyup.enter="record('key')" @blur="record('blur')" @keyup.esc="edit = !edit" class="w-100 h-100">
        </div>

        <span v-else 
            @click="edit = !edit" 
            @keyup="edit = !edit" 
            @mousedown="$emit('point-cell-start')" 
            @mouseup="$emit('point-cell-end')" 
            @mouseover="$emit('point-cell-over')"

            class="d-block px-1 py-1 w-100 h-100" 

            :class="className">
                <span v-if="activevalue > 0 || activevalue < 0">
                    {{activevalue}}
                </span>
        </span>
    </div>
</template>

<style lang="scss">
    .planning-cell-comp {
        position:absolute;
        top:0px;left:0px;right:0px;bottom:0px;

        span {
            cursor: pointer;
        }

        .bg-weekend{
            background-color: #e9ecef;
        }

        .bg-weekend:hover {
            background-color: darken(#e9ecef, 10%);
        }

        .bg-light:hover {
            background-color: #dae0e5 !important;
        }

        .bg-light.selected {
            background-color: lighten(#cff4fc, 5%) !important;
        }

        .bg-light.selected:hover {
            background-color: #cff4fc !important;
        }

        .bg-weekend.selected {
            background-color: #cff4fc !important;
        }

        .bg-weekend.selected:hover {
            background-color: darken(#cff4fc,10%) !important;
        }
    }
</style>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    props:{
        value: Number,
        i: Number,
        j: Number,
        metier: Object,
        jour: Date,
        selected: Boolean
    },

    data() {
        return {
            edit: false,
            activevalue: null,
            recordedvalue: null,
            blur: 0
        }
    },

    computed: {
        ...mapState(['projet']),

        /**
         * Retourne la liste des classes CSS à appliquer à la cellule en fonction du contexte (sélectionnée/non, week-end...)
         * 
         * @returns {string}
         */
        className() {
            let classList = '';

            if (this.selected) {
                classList += ' selected ';
            }

            if (6 === this.jour.getDay() || 0 === this.jour.getDay()) {
                classList += ' bg-weekend ';
            } else {
                classList += ' bg-light ';
            }

            return classList;
        },

        /**
         * Récupère le projet id en fonction du projet chargé dans le storage-modal
         * 
         * @return  {?number}
         */
        projet_id() {
            if (this.projet) {
                return this.projet.id;
            } 

            return null;
        }
    },

    watch: {
        /**
         * Lors d'une modification de la proriété externe value, recordedvalue et activevalue
         * sont ré-affectées.
         * 
         * @param {number} val
         */
        value(val) {
            this.recordedvalue = val;
            this.activevalue = val;
        }
    },

    methods:{
        ...mapActions(['refreshRessourcesBesoin']),

        /**
         * Action déclenchée lors de l'enregistrement d'une cellule.
         * 
         * @emit recorded           Événement envoyé lorsque l'enregistrement est terminée
         */
        record() {
            if (this.recordedvalue != this.activevalue) {
                this.$refs.valueinput.disabled = true;

                let newRessourcesBesoin = [];

                let urlApi = '/ressourcesBesoin/POST/findOrCreate';

                this.$app.apiPost(urlApi, {
                    nb: this.activevalue,
                    projet_id: this.projet_id,
                    projet__liaison_besoin_rh_id: this.metier.id,
                    dd: this.jour.getSqlDate()
                }).then( (data) => {
                    this.edit = false;
                    this.activevalue = data.nb;

                    newRessourcesBesoin['action'] = "update";
                    newRessourcesBesoin['data'] = [data];

                    this.refreshRessourcesBesoin(newRessourcesBesoin);
                }).catch( (error) => {
                    console.log(error);
                    this.$refs.valueinput.classList.add("bg-warning");
                    this.$refs.valueinput.disabled = false;
                });

                this.recordedvalue = this.activevalue;
            } else {
                this.edit = false;
            }
        }
    },

    updated() {
        if (this.edit) {
            this.$refs.valueinput.focus();
        }
    },

    mounted() {
        this.recordedvalue = this.value;
        this.activevalue = this.value;
    }
}
</script>