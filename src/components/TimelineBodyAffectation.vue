<template>
    <tbody class="bg-white" v-for="projet in projetsList" :key="'projet-'+projet.id">
        <tr>
            <th class="title_projet_affectation" :colspan="daysList.length + 1">
                <i :id="'fas-projet-'+projet.id" class="fas fa-angle-down sticky_metier sticky1_metier_title" @click="toggleProjet(projet.id)" style="cursor: pointer;"></i>
                <span class="pr-4 sticky_metier sticky2_metier_title">{{projet.intitule}}</span> 
                <a href="#?" class="hover_date text-secondary sticky_metier sticky3_metier_title" @click="filterTimeline('ddp', projet.ddp)">{{projet.ddp}}</a> 
                <span class="sticky_metier sticky4_metier_title"> /</span>
                <a href="#?" class="hover_date pr-4 text-secondary sticky_metier sticky5_metier_title" @click="filterTimeline('dfp', projet.dfp)">{{projet.dfp}}</a>
                <a :href="'/mkg/modules/organisation/private/php/projet_4_app.php?projet_id='+projet.id+'&view=ressource#!ressource/besoins'" class="btn btn-outline-primary mx-2 sticky_metier sticky6_metier_title" target="_blank">
                    Définir les besoins
                </a>
            </th>
        </tr>
        
        <!-- <tr v-if="metierFilter == metier.ressources__rh_type_id || metierFilter == 0"
          ----<<<  v-if="metierFilter.find(e => e == metier.ressources__rh_type_id) || metierFilter.length == 0" >>>-------
        -->
        <tr 
            v-for="(metier, i) in projet.besoins_rh" :key="'metier'+i"  

            :class="{'cursor-pointer' : modeAffectation && selected_metier != metier}"

            @click = "checkTiming({
                'filtre' : 'metier', 
                'projet' : projet,
                'metier' : metier,
                'key' : i,
            }, 'selectionOnly')"
        >
            <th class="text-left px-2" 
                :class="classNameBgCell(metier)" 
                style="min-width:250px;">


                <div class="d-flex justify-content-between align-items-center">
                    <span :title="metier.oType.nom">
                        {{metier.oType.nom.cutText(15)}}
                    </span>

                    <em>{{perDict[metier.periode_code]}}</em>
                </div>
            </th>

            <td
                v-for="(jour, j) in daysList"
                class="text-right planning-cell"
                :class=" classListCellChantier(metier, jour)"

                :key="j"
                :title="jour.getSqlDate()">

                <!-- <cell-resume
                    v-if="!modeAffectation && getBesoinNb(metier, jour)"
                    :value="getBesoinNb(metier, jour)" 
                    :i="i" 
                    :j="j" 
                    :metier="metier" 
                    :jour="jour" 
                    :projet_id="projet.id"
                    :list-ressources-affectations="listRessourcesAffectations(metier, jour)"
                    :selected_metier = "selected_metier"


                    :ref="'cell-'+i+'-'+j">
                </cell-resume>

                <cell-affectation
                    v-else-if="modeAffectation && getBesoinNb(metier, jour)"
                    :besoin="getBesoin(metier, jour)"
                    :i="i" 
                    :j="j" 
                    :metier="metier" 
                    :projet="projet"
                    :jour="jour" 
                    :projet_id="projet.id"
                    :list-ressources-affectations="listRessourcesAffectations(metier, jour)"
                    :active-personnel="activePersonnel"
                    :selected_metier = "selected_metier"
                     

                    :ref="'cell-'+i+'-'+j"

                    @read-personne-infos="readPersonneInfos"
                    @update-ressources-affectations="updateRessoucesAffectations"
                >
                </cell-affectation>
                 -->
            </td>
        </tr>
    </tbody>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['timeline']),
        
        /**
         * Retourne la liste des dates (objet Date) start et end.
         * @returns {Array}
         */
        daysList() {
            return Date.listDays(this.timeline.start, this.timeline.end);
        },
    }
}
</script>