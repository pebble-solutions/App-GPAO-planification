<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user"
		@structure-change="switchStructure">

		<template v-slot:header>
			<div class="d-flex align-items-center" v-if="isRessources && projet">
				<router-link :to="{name:'EditProjet', params:{id:'419'}}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-dark mx-2">{{projet.intitule}} <i class="bi bi-pencil-fill"></i></a>
				</router-link>

				<router-link :to="{name:'ConfigHeures', params:{id:'419'}}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-secondary mx-2"><i class="bi bi-clock-fill"></i> Heure de travail</a>
				</router-link>
				
				<router-link :to="{name:'Affectations'}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-primary mx-2"><i class="bi bi-person-check-fill"></i> Affecter du personnel</a>
				</router-link>

				<router-link :to="{name:'EditTimeline', params:{id:'419'}}" custom v-slot="{navigate, href}">
					<a :href="href" @click="navigate" class="btn btn-secondary mx-2"><i class="bi bi-calendar3"></i> {{getDateHuman(timeline.start)}} <i class="bi bi-chevron-compact-right"></i> {{getDateHuman(timeline.end)}}</a>
				</router-link>
			</div>


			<div class="d-flex align-items-center" v-if="isAffectation">

                <div class="mx-2 border-secondary">
                    <a href="#!affectation/projects" class="btn btn-secondary"><i class="fas fa-project-diagram"></i> {{projetLabel}}</a>
                </div>

                <div class="mx-2">
                    <a href="#!affectation/metiers" class="btn btn-secondary"><i class="fas fa-briefcase"></i> {{metierLabel}}</a>
                </div>
                
                <div class="mx-2">
                    <a href="#!affectation/date" class="btn btn-secondary"><i class="fas fa-calendar-alt"></i> {{getDateHuman(timeline.start)}} <i class="fas fa-arrow-right"></i> {{getDateHuman(timeline.end)}}</a>
                </div>

                <div class="mx-2">
                    <a href="#!affectation/partager" class="btn btn-primary"><i class="fas fa-share-square"></i> Partager</a>
                </div>
            </div>

		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem href="/" look="dark" icon="bi bi-house">Accueil</AppMenuItem>
				<AppMenuItem href="/ressources/419" look="dark" icon="bi bi-boxes">Ressources</AppMenuItem>
				<AppMenuItem href="/affectations" look="dark" icon="bi bi-person-plus-fill">Affectations</AppMenuItem>
				<AppMenuItem href="/planning" look="dark" icon="bi bi-calendar2">Planning</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<AppMenu>
				<!-- <AppMenuItem :href="'/element/'+el.id" icon="bi bi-file-earmark" v-for="el in elements" :key="el.id">{{el.name}}</AppMenuItem> -->
			</AppMenu>
		</template>

		<template v-slot:core>
			<div class="px-2 bg-light">
				<router-view :cfg="cfg" v-if="isConnectedUser" @obj-projet="updateProjet"/>
			</div>
		</template>

	</AppWrapper>
	
</template>

<script>

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
// import { mapActions, mapState } from 'vuex'

import CONFIG from "@/config.json"
import '@/js/date.js'



export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				elements: true,
			},
			isConnectedUser: false,
			projet:null,
			timeline: {
				start:null,
				end:null
			},
		}
	},

	computed: {
		// ...mapState(['elements', 'openedElement'])
		isRessources() {
			if(	this.$route.name === 'Ressources' || 
				this.$route.name === 'AjoutGroup' || 
				this.$route.name === 'ConfigHeures' || 
				this.$route.name === 'EditProjet' || 
				this.$route.name === 'EditTimeline' ||
				this.$route.name === 'AjoutBesoins') 
			{
				return true;
			}

			return false;
		},

		isAffectation() {
			if(this.$route.name === 'Affectations') {
				return true;
			}

			return false;
		}
	},

	methods: {
		/**
		 * Retourne la représentation d'une date lisible par un humain.
		 * @param {DateTime} date Date à analyser
		 * @param {String} fallbackText Texte à afficher au cas ou date est non renseigné (défaut '')
		 * @returns {String}
		 */
		getDateHuman(date, fallbackText) {
			fallbackText = typeof fallbackText === 'undefined' ? '' : fallbackText;

			if (date) {
				return date.toLocaleDateString('fr-FR', {month:'2-digit', day:'2-digit', year:'numeric'});
			}
			else {
				return fallbackText;
			}
		},


		/**
		 * Met à jour les informations de l'utilisateur connecté
		 * @param {Object} user Un objet LocalUser
		 */
		setLocal_user(user) {
			if (user) {
				this.$store.dispatch('login', user);
				this.isConnectedUser = true;
			}
			else {
				this.$store.dispatch('logout');
				this.isConnectedUser = false;
			}
		},

		/**
		 * Envoie une requête pour lister les éléments et les stocke dans le store
		 * 
		 * @param {Object} params Paramètre passés en GET dans l'URL
		 * @param {String} action 'update' (défaut), 'replace', 'remove'
		 */
		listElements(params, action) {
			action = typeof action === 'undefined' ? 'update' : action;
			this.$app.listElements(this, params)
			.then((data) => {
				this.$store.dispatch('refreshElements', {
					action,
					elements: data
				});
			})
			.catch(this.$app.catchError);
		},

		/**
		 * Change de structure, vide le store
		 * 
		 * @param {Integer} structureId
		 */
		switchStructure(structureId) {
			this.$router.push('/');
			this.$store.dispatch('switchStructure', structureId);
			this.listElements();
		},

		/**
		 * Met a jour l'objet projet
		 * @param {Objet} projet
		 */
		updateProjet(projet) {
			console.log(projet);
			this.projet = projet;
		}
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem
	},

	mounted() {
		this.timeline.start = new Date();
        this.timeline.start = this.timeline.start.getMonday();

        this.timeline.end = new Date(this.timeline.start);
        this.timeline.end.setDate(this.timeline.start.getDate() + 28);
	}


}
</script>