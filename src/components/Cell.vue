<template>
    <div class="planning-cell-comp">
        <div v-if="edit" class="w-100 h-100">
            <input ref="valueinput" type="number" v-model="activevalue" @keyup.enter="record" @blur="record" @keyup.esc="edit=!edit" class="w-100 h-100">
        </div>
        <span v-else 
            @click="edit=!edit" 
            @keyup="edit=!edit" 
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

export default {
    props:{
        value: Number,
        i: Number,
        j: Number,
        metier: Object,
        jour: Date,
        projet_id: Number,
        selected: Boolean
    },

    data() {
        return {
            edit: false,
            activevalue: null,
            recordedvalue: null
        }
    },

    computed: {
        /**
         * Retourne la liste des classes CSS à appliquer à la cellule en fonction du contexte (sélectionnée/non, week-end...)
         * @returns {String}
         */
        className() {
            let classList = '';

            if (this.selected) {
                classList += ' selected ';
            }

            if (this.jour.getDay() === 6 || this.jour.getDay() === 0) {
                classList += ' bg-weekend ';
            } else {
                classList += ' bg-light ';
            }

            return classList;
        }
    },

    watch: {
        /**
         * Lors d'une modification de la proriété externe value, recordedvalue et activevalue
         * sont ré-affectées.
         * @param {Float} val
         */
        value(val) {
            this.recordedvalue = val;
            this.activevalue = val;
        }
    },

    methods:{
        /**
         * Action déclenchée lors de l'enregistrement d'une cellule.
         * 
         * @emit recorded           Événement envoyé lorsque l'enregistrement est terminée
         */
        record(){
            if(this.recordedvalue != this.activevalue)
            {
                this.$refs.valueinput.disabled = true;
                let urlApi = '/ressourcesBesoin/POST/findOrCreate';

                console.log('activevalue', this.activevalue);
                console.log('projet id', this.projet_id);
                console.log('metier id', this.metier.id);
                console.log('jour', this.jour.getSqlDate());

                this.$app.apiPost(urlApi, {
                    nb: this.activevalue,
                    projet_id: this.projet_id,
                    projet__liaison_besoins_rh_id: this.metier.id,
                    dd: this.jour.getSqlDate()
                }).then( (data) => {
                    console.log(data);
                    this.edit=false;
                    this.activevalue = data.nb;
                    this.$emit("recorded", {i:this.i, j:this.j, data:data});


                }).catch((error) => {
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
        if(this.edit) {
            this.$refs.valueinput.focus();
        }
    },

    mounted() {
        this.recordedvalue = this.value;
        this.activevalue = this.value;
    }
}
</script>