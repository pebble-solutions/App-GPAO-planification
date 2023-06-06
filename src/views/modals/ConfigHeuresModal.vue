<template>
    <AppModal title="Configurer les heures de travail" :cancel-btn="true" :pending="pending.projet" :submit-btn="true" class-list="modal-dialog-scrollable" @modal-hide="backPreviousRoute()" @submit="recordProjet()">
        <div v-if="tmpProjet">
            <table class="table table-borderless">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Début</th>
                        <th scope="col">Durée</th>
                    </tr>
                </thead>
    
                <tbody>
                    <tr>
                        <th scope="row">
                            Matin
                        </th>
    
                        <td>
                            <div class="border-bottom border-dark">
                                <label for="debutmatin" class="form-label" hidden>Début matin</label>
                                <input id="debutmatin" class="form-control border-0" type="time" v-model="tmpProjet.periode_matin_hd" step="5" >
                            </div>
                        </td>
    
                        <td>
                            <div class="border-bottom border-dark">
                                <label for="dureematin" class="form-label" hidden>Durée matin</label>
                                <input id="dureematin" class="form-control border-0" type="time" v-model="tmpProjet.periode_matin_duree" max="10:00" step="900">
                            </div>
                        </td>
                    </tr>
    
                    <tr>
                        <th scope="row">
                            Après-midi
                        </th>
    
                        <td>
                            <div class="border-bottom border-dark">
                                <label for="debutapresmidi" class="form-label" hidden>Début Après-midi</label>
                                <input id="debutapresmidi" class="form-control border-0" type="time" v-model="tmpProjet.periode_apresmidi_hd" step="5">
                            </div>
                        </td>
    
                        <td>
                            <div class="border-bottom border-dark">
                                <label for="dureeapresmidi" class="form-label" hidden>Durée Après-midi</label>
                                <input id="dureeapresmidi" type="time" class="form-control border-0" v-model="tmpProjet.periode_apresmidi_duree" max="10:00" step="900">
                            </div>
                        </td>
                    </tr>
    
                    <tr>
                        <th scope="row">
                            Jour
                        </th>
    
                        <td>
                            <div class="border-bottom border-dark">
                                <label for="debutjour" class="form-label" hidden>Début Jour</label>
                                <input id="debutjour" type="time" class="form-control border-0" v-model="tmpProjet.periode_journee_hd" step="5">
                            </div>
                        </td>
    
                        <td>
                            <div class="border-bottom border-dark">
                                <label for="dureejour" class="form-label" hidden>Durée Jour</label>
                                <input id="dureejour" type="time" class="form-control border-0" v-model="tmpProjet.periode_journee_duree" max="10:00" step="900">
                            </div>
                        </td>
                    </tr>
    
                    <tr>
                        <th scope="row">
                            Nuit
                        </th>
    
                        <td>
                            <div class="border-bottom border-dark">
                                <label for="debutnuit" class="form-label" hidden>Début Nuit</label>
                                <input id="debutnuit" type="time" class="form-control border-0" v-model="tmpProjet.periode_nuit_hd" step="5">
                            </div>
                        </td>
    
                        <td>
                            <div class="border-bottom border-dark">
                                <label for="dureenuit" class="form-label" hidden>Durée Nuit</label>
                                <input id="debutnuit" type="time" class="form-control border-0" v-model="tmpProjet.periode_nuit_duree" max="10:00" step="900">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue';
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return{
            pending:{
                projet: false
            },
            routeProjetListId: null
        }
    },

    computed: {
        ...mapState(['projetsList']),

        projet() {
            return this.projetsList.find(p => p.id == this.$route.params.id);
        },
        
        tmpProjet() {
            return this.initTmpProje();
        }
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeProjetListId = from.params.projetListId;
        })
    },  

    components: {AppModal},

    methods: {
        ...mapActions(['refreshProjetsList', 'editProjetFomProjetsList']),
        /**
         * Put back the url route before the modal route
         */
        backPreviousRoute() {
            this.$router.push({name:"Ressources", params:{projetListId: this.routeProjetListId}});
        },

        /**
         * Initialise une copy de projet
         */
        initTmpProje(){
            let tmpProjet = {};

            for(let key in this.projet){
                if(typeof this.projet[key] !== "object")
                    tmpProjet[key] = this.projet[key];
            }

            return tmpProjet;
        },

        /**
         * recordProjet(props)
         * Enregistre les valeurs du formulaire de la modification du projet et de l'adresse du projet
         * Traitement au retour
         */
        recordProjet(){
            this.pending.projet = true;

            let urlApiProjet = "/projet/POST/"+this.projet.id +"/";

            this.$app.apiPost(urlApiProjet, this.tmpProjet)
            .then( (data) => {
                let projetList = data;
                this.editProjetFomProjetsList(projetList);

                this.pending.projet = false;
                this.backPreviousRoute();
            }).catch(this.$app.catchError);
        },

    }
}
</script>