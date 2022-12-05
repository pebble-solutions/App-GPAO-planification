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
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            pending: {
                ressources_rh_type: false
            },
            routeProjetListId: null
        }
    },

    computed: {
        ...mapState(['ressourcesRHType', 'projetsList']),

        projet() {
            return this.projetsList.find(p => p.id == this.$route.params.id);
        },

        tmpProjet() {
            return this.initTmpProjet();
        },

        besoins() {
            if (this.ressourcesRHType) {
                return this.initBesoinsModal();
            }

            return null;
        }
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeProjetListId = from.params.projetListId;
        })
    },  

    components: {
        AppModal
    },

    methods: {
        ...mapActions(['refreshRessourcesRHType', 'editProjetFomProjetsList']),

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

            query.besoins_rh = JSON.stringify(this.besoins);

            let urlApi = "/projet/POST/"+this.projet.id +"/define_besoins_rh?list_besoins_rh=1";

            this.$app.apiPost(urlApi, query)
            .then( (data) => {
                this.editProjetFomProjetsList(data);

                this.pending.ressources_rh_type = false;
                this.backPreviousRoute();
            }).catch(this.$app.catchError);
        },

        /**
         * On initialise dans un tableau (array, $besoins) temporaire les objects qui contient les valeurs qu'on veux afficher
         * 
         * À la fin de l'initialisation la boite modale est appelée.
         */
        initBesoinsModal() {
            let besoins = [];

            this.ressourcesRHType.forEach(e => {
                let codes = ['m', 'a', 'j', 'n'];
                let found = {};

                codes.forEach(c => {
                    found[c] = this.projet.besoins_rh.find(brh => brh.periode_code == c.toUpperCase() && brh.oType.id == e.id);
                });

                besoins.push({
                    ressources__rh_type_id: e.id,
                    nom: e.nom,
                    m: found.m ? true : false,
                    a: found.a ? true : false,
                    j: found.j ? true : false,
                    n: found.n ? true : false,
                });
            });    

            this.initTmpProjet();
            
            return besoins;
        },

        /**
         * Initialise une copy de projet
         */
        initTmpProjet() {
            let projet = {};
            projet.oAdresse = {};

            for (let key in this.projet) {
                if(typeof this.projet[key] !== "object")
                    projet[key] = this.projet[key];
            }

            for (let key in this.projet.oAdresse) {
                if(typeof this.projet.oAdresse[key] !== "object")
                    projet.oAdresse[key] = this.projet.oAdresse[key];
            }
            
            return projet;
        },

        /**
         * Récupère une liste de ressources rh type et l'enregistre dans le store
         */
        getRessourcesRHType() {
            let urlApi = "/ressourcesRHType/GET/list";

            this.$app.apiGet(urlApi)
            .then((data) => {
                this.refreshRessourcesRHType(data);

                this.pending.ressources_rh_type=false;
            }).catch(this.$app.catchError);
        },

        /**
         * Retourne a la page précédente
         */
        backPreviousRoute() {
            this.$router.push({name:"Ressources", params:{projetListId: this.routeProjetListId}});
        }
    },

    mounted() {
        if (!this.ressourcesRHType) {
            this.getRessourcesRHType();
        }
    }
}
</script>