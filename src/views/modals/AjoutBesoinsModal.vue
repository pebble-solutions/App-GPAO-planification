<template>
    <AppModal id="ajoutBesoins" title="Modifier les métiers" :pending="pending.ressources_rh_type" :submit-btn="true" :close-btn="true" size="lg" class-list="modal-dialog-centered modal-dialog-scrollable" @submit="recordBesoins()" @modal-hide="backPreviousRoute()">
        <div v-if="besoins && tmpProjet">
            <table class="table table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">Métier</th>
                        <th scope="col" class="text-right">Matin</th>
                        <th scope="col" class="text-right">Après-midi</th>
                        <th scope="col" class="text-right">Journée</th>
                        <th scope="col" class="text-right">Nuit</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="besoin in besoins" :key="besoin.id">
                        <th scope="row">{{besoin.nom}}</th>

                        <td>
                            <div class="custom-control custom-checkbox text-right">
                                <input :id="besoin.nom + '-m'" class="custom-control-input" type="checkbox" v-model="besoin.m">
                                <label class="custom-control-label" :for="besoin.nom + '-m'"></label>
                            </div>
                        </td>

                        <td>
                            <div class="custom-control custom-checkbox text-right">
                                <input :id="besoin.nom + '-a'" type="checkbox" class="custom-control-input" v-model="besoin.a">
                                <label class="custom-control-label" :for="besoin.nom + '-a'"></label>
                            </div>

                        </td>

                        <td>
                            <div class="custom-control custom-checkbox text-right">
                                <input :id="besoin.nom + '-j'" class="custom-control-input" type="checkbox" v-model="besoin.j">
                                <label class="custom-control-label" :for="besoin.nom + '-j'"></label>
                            </div>
                        </td>

                        <td>
                            <div class="custom-control custom-checkbox text-right">
                                <input :id="besoin.nom + '-n'" class="custom-control-input" type="checkbox" v-model="besoin.n">
                                <label class="custom-control-label" :for="besoin.nom + '-n'"></label>
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

export default {
    props: {
        projet: Object,
    },

    data() {
        return {
            pending: {
                ressources_rh_type: false
            },
            projetInstance: null,
            ressources_rh_type:null,
            besoins: [],
            tmpProjet: null
        }
    },

    // computed: {
    //     tmpProjet() {
    //         return this.initTmpProjet();
    //     }
    // },

    components: {
        AppModal
    },

    methods: {
         /**
         * Enregistre les valeurs du formulaire de la modification besoins sur la journée des métier ('matin', 'apres-midi', 'journée', 'nuit')
         * Traitement au retour
         */
        recordBesoins() {
            this.pending.ressources_rh_type = true
            let query = {};

            query.periode_matin_hd = this.tmpProjet.periode_matin_hd;
            query.periode_matin_duree = this.tmpProjet.periode_matin_duree;
            query.periode_apresmidi_hd = this.tmpProjet.periode_apresmidi_hd;
            query.periode_apresmidi_duree = this.tmpProjet.periode_apresmidi_duree;
            query.periode_journee_hd = this.tmpProjet.periode_journee_hd;
            query.periode_journee_duree = this.tmpProjet.periode_journee_duree;
            query.periode_nuit_hd = this.tmpProjet.periode_nuit_hd;
            query.periode_nuit_duree = this.tmpProjet.periode_nuit_duree;

            query.besoins_rh = JSON.stringify(this.tmpBesoins);

            let urlApi = "/projet/POST/"+this.projet.id +"/define_besoins_rh?list_besoins_rh=1";

            this.$app.apiPost(urlApi, query)
            .then( (data) => {
                console.log('result !!!!!!', data);
                for(let key in data){
                    this.projetInstance[key] = data[key];
                    //this.$emit('update-projet', data);

                    this.pending.ressources_rh_type = false;
                    this.backPreviousRoute();
                }
            }).catch(this.$app.catchError);
        },

        /**
         * On initialise dans un tableau (array, $tmpBesoins) temporaire les objects qui contient les valeurs qu'on veux afficher
         * 
         * À la fin de l'initialisation la boite modale est appelée.
         */
        initBesoinsModal() {
            this.besoins = [];

            this.ressources_rh_type.forEach(e => {
                let codes = ['m', 'a', 'j', 'n'];
                let found = {};

                codes.forEach(c => {
                    found[c] = this.projet.besoins_rh.find(brh => brh.periode_code == c.toUpperCase() && brh.oType.id == e.id);
                });

                this.besoins.push({
                    ressources__rh_type_id: e.id,
                    nom: e.nom,
                    m: found.m ? true : false,
                    a: found.a ? true : false,
                    j: found.j ? true : false,
                    n: found.n ? true : false,
                });
            });    

            this.initTmpProjet();
        },

        /**
         * Initialise une copy de projet
         */
        initTmpProjet(){
            this.tmpProjet = {};
            this.tmpProjet.oAdresse = {};

            for(let key in this.projet){
                if(typeof this.projet[key] !== "object")
                    this.tmpProjet[key] = this.projet[key];
            }

            for(let key in this.projet.oAdresse){
                if(typeof this.projet.oAdresse[key] !== "object")
                    this.tmpProjet.oAdresse[key] = this.projet.oAdresse[key];
            }
        },

        getRessourcesRHType() {
            let urlApi = "/ressourcesRHType/GET/list";

            this.$app.apiGet(urlApi)
            .then((data) => {
                this.ressources_rh_type = data;

                this.initBesoinsModal();

                this.pending.ressources_rh_type=false;
            }).catch(this.$app.catchError);

            /**COMLPLIQUER A METTRE EN PLACE */
            // readHash();
        },

        backPreviousRoute() {
            this.$router.push({name:"Ressources", params:{id: this.projet.id}})
        }
    },

    mounted() {
        this.projetInstance = this.projet;
        this.getRessourcesRHType();

        console.log(this.besoins);
    }
}
</script>