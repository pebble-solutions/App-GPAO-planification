<template>
    <div>Le liste ici</div>
    <!-- <div class="m-2">
        <h3 v-if="!modeAffectation && personnels_global.length == 0" class="text-center"><i class="fas fa-question-circle"></i><br>Comment ça marche ?</h3>

        <div v-if="!modeAffectation && personnels_global.length == 0" class="card my-3 border-primary hover_bg_affect" :class="ClassListhash('box', 'projects')">
            <a href="#!affectation/projects" class="card-body text-decoration-none" :class="ClassListhash('text', 'projects')">
                <h4>
                    <i class="fas fa-project-diagram"></i> 
                    <span v-if="projets_id.length == 0">Sélectionnez vos projets</span><span v-else>{{projetLabel}} sélectionné<span v-if="projets_id.length > 2">s</span></span> 
                </h4>
                <p>
                    Plannifier un ou plusieurs projets en même temps. Cliquez ici pour afficher la liste des projets ou via le filtre.
                </p>
            </a>
        </div>
        
        <div v-if="!modeAffectation && personnels_global.length == 0" class="card my-3 border-primary hover_bg_affect" :class="ClassListhash('box', 'metiers')">
            <a href="#!affectation/metiers" class="card-body text-decoration-none" :class="ClassListhash('text', 'metiers')">
                <h4>
                    <i class="fas fa-briefcase"></i>
                    <span v-if="metiers_id.length == 0">Sélectionnez les métiers</span><span v-else>{{metierLabel}} sélectionné<span v-if="metiers_id.length > 1">s</span></span> 
                </h4>

                <p>
                    Sélectionnez un ou plusieur métier dans la barre de filtre afin d'afficher la liste.
                </p>
            </a>
        </div>

        <div v-if="projet_id || metier_id" class="card border-primary hover_bg_affect" :class="modeAffectation ? 'bg-primary' : '' " style="cursor:pointer">
            <div class="card-body" :class="modeAffectation ? 'text-white' : 'text-primary'" @click="toggleModeAffectation()">
                <h4 :class="modeAffectation && personnels_global.length == 0 ? '' : 'mb-0'">
                    <i v-if="modeAffectation" class="fas fa-user-check"></i> 
                    <i v-else class="far fa-square"></i>
                    Mode Affectation
                </h4>

                <p v-if="modeAffectation && personnels_global.length == 0">
                    Cochez les cellules dans lesquels vous souhaitez affecter le personnel sélectionné. Lorsque la cellule 
                    passe au vert, l'ensemble des besoins sont remplis.
                </p>
            </div>
        </div>

        <div v-else class="card my-3 badge-secondary border-secondary" style="cursor:not-allowed;">
            <div class="card-body text-white">
                <h4>
                    <i class="far fa-square"></i>
                    Mode Affectation
                </h4>

                <p>
                    Sélectionner un projet ou un metier pour pouvoir affecter du personnel.
                </p>
            </div>
        </div>
    </div>
    <div v-if="pending.personnels_global" class="text-center text-secondary my-3">
        <div class="spinner-grow" role="status"></div>
        <div>Chargement des candidats...</div>
    </div>

    <div class="m-2" v-if="emptyListPersonnels">
        <div class="card my-3">
            <div class="card-body text-danger">
                <h4><i class="fas fa-user-slash"></i> Aucun personnel</h4>
                <p>
                    Aucun personnel habilité pour le metier sélectionné : <span class="font-italic font-weight-bold">{{emptyListPersonnels}}!</span>
                </p>
            </div>
        </div>
    </div> -->
    
    <!-- Component personnelList a creer  -->
    <!-- <div v-if="personnels_global.length > 0" @keyup="filterPersonnelList()" class="m-2 border-bottom d-flex">
        <div class="input-group">
            <input type="text" placeholder="Rechercher" class="form-control" v-model="searchPersonnel">
        </div>
    </div>

    <app-menu>
        <app-menu-item :active="isActivePersonnel(personnel, 'list')" v-for="personnel in list_personnel_result" :href="'#!'+personnel.id" :key="personnel.id" @click="toggleActicePersonnel(personnel)">
            <div class="d-flex justify-content-between align-items-center">

                <div 
                    :style="'line-height:40px;min-width:40px;min-height:40px;background-color:'+personnel.cache_nom.toColor()+';border-radius:50%;color:white;'" 
                    class="text-center mr-2 font-weight-bold" 
                    :title="personnel.cache_nom">
                    {{personnel.cache_nom.nameInitials()}}
                </div>
    
                <div class="mb-1  d-flex flex-column">
                    {{personnel.cache_nom}}
    
                    <div>
                        <small v-for="metier in personnel.metiers" class="badge badge-primary badge-pill mr-1">{{metier}}</small>
                    </div>
                </div>
    
                <small v-if="personnel.distance_txt" class="badge badge-danger pl-2 pr-2 text-white ml-auto">{{personnel.distance_txt}}</small>
                <small v-else class="badge badge-secondary pl-2 pr-2 text-white ml-auto">NC</small>
            </div>
        </app-menu-item>
    </app-menu> -->
</template>

<script>
export default {
    props : {
        projet: Object
    },

    data() {
        return {
            pending: {
                personnels_global: null
            },
            modeAffectation: false,
            personnels_global: null,
        }
    },

    mounted() {
        console.log('the projet', this.projet);
    }
}
</script>