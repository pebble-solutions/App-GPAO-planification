<template>
    <AppModal id="ajoutGroup" title="Ajout Groupé" :pending="pending.ajoutgroupe" :submit-btn="true" :cancel-btn="true" @submit.prevent="addToGroup()">
        <div v-if="projet && ressources_besoin_group">
            <div class="form-group">
                <label for="selectmetier">Choissisez un métier:</label>

                <select class="form-control" id="selectmetier" name="projet__liaison_besoin_rh_id" v-model="ressources_besoin_group.projet__liaison_besoin_rh_id">
                    <option v-for="(metier) in projet.besoins_rh" :value="metier.id" :key="metier.id">{{metier.oType.nom}} ({{metier.periode_code}})</option>
                </select>
            </div>
    
            <!--date début date fin-->
            <div class="form-row">
                <div class="form-group col">
                    <label for="datedebut">date début:</label>
                    <input type="date" class="form-control" id="datedebut" name="dd" :min="projet.ddp" :max="projet.dfp" v-model="ressources_besoin_group.dd" required>
                </div>
    
                <div class="form-group col">
                    <label for="datefin">date fin:</label>
                    <input type="date" class="form-control" id="datefin" name="df" :min="projet.ddp" :max="projet.dfp" v-model="ressources_besoin_group.df" required>
                </div>

                <div class="from-group col">
                    <label for="quantity">Nombre:</label>
                    <input type="number" class="form-control" name="nb" id="quantity" v-model="ressources_besoin_group.nb" required>
                </div>
            </div>
    
            
            <hr>  
            
            <!--jours de semaine-->
            <h3>Jours</h3>
            
            <div class="form-row">
                <div class="col" v-for="(gp, k) in days" :key="k">
                    <div v-for="(i, day) in gp" :key="day">
                        <div class="form-check form-switch">
                            <input type="checkbox" name="days[]" class="form-check-input" role="switch" :id="day" value="1" v-model="ressources_besoin_group.days[i]">
                            <label class="form-check-label" :for="day">{{day}}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';

let BESOIN_GROUP_PROPS = {
    dd: null,
    df: null,
    nb: 0,
    projet_id: null,
    projet__liaison_besoin_rh_id: null,
    days: [false, false, false, false, false, false, false]
}

export default {

    props: {
        ajoutGroupe : Boolean,
        projet: Object,
    },

    data() {
        return {
            ressources_besoin_group : {},
            days: [{lundi:0,mardi:1, mercredi:2, jeudi:3, vendredi:4}, {samedi:5, dimanche:6}],
            pending: {
                ajoutgroupe: false
            }
        }
    },

    components: {
        AppModal
    },

    methods: {
        addToGroup() {

        },


        /**
         * initGroupModal()
         * Initialise une copie des données par défaut lors de la création par groupe. Les 
         * données par défaut sont stockées dans la constante BESOIN_GROUP_PROPS et dupliquées 
         * sur la variable locale ressources_besoin_group.
         * À la fin de l'initialisation la boite modale est appelée.
         */
        initGroupModal() {
            for (let key in BESOIN_GROUP_PROPS) {
                this.ressources_besoin_group[key] = BESOIN_GROUP_PROPS[key];
            }
        },
    },

    mounted() {
        this.initGroupModal();
    },
}
</script>