<template>
    <AppModal title="Configurer les heures de travail" :close-btn="true" :pending="pending.projet" :submit-btn="true" class-list="modal-dialog-scrollable">
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

export default {
    data() {
        return{
            pending:{
                projet: false
            }
        }
    },

    components: {
        AppModal
    }
}
</script>