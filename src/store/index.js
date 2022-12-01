import { createStore } from 'vuex'

export default createStore({
	state: {
		structures: [],
		activeStructureId: null,
		login: null,
		elements: [],
		openedElement: null,
		tmpElement: null,
		
		selectedCells: null,
		ressourcesBesoin: null,
		projetsList: [],
		projetsActifs: [],
		ressourcesRHType: null,
		timeline: {
			start: null,
			end: null,
			now: new Date()
		},
		page: {
			ressources: false,
			affectation: false
		}
	},

	getters: {
		activeStructure(state) {
			return state.structures.find(e => e.id === state.activeStructureId);
		}
	},

	mutations: {
		/**
		 * Charge un objet dans openedElement
		 * 
		 * @param {Object} state Le state de l'instance VueX
		 * @param {number} id L'ID de l'élément à charger
		 */
		open(state, id) {
			state.openedElement = id;
		},


		/**
		 * Ferme l'élément ouvert
		 * 
		 * @param {Object} state Le state de l'instance VueX
		 */
		close(state) {
			state.openedElement = null;
		},

		/**
		 * Remplace la liste des éléments chargés avec une nouvelle liste
		 * 
		 * @param {Object} state		Le state de l'instance VueX
		 * @param {Array} elements		La nouvelle liste d'éléments
		 */
		replaceElements(state, elements) {
			state.elements = elements;
		},

		/**
		 * Rafraichie la liste des éléments chargés à partir d'une autre liste.
		 * - si un élément existe dans state et dans elements, il est actualisé avec le nouveau
		 * - si un élément est dans elements mais pas dans state, il est ajouté
		 * 
		 * @param {Object} state		Le state de l'instance VueX
		 * @param {Array} elements		La nouvelle liste d'éléments
		 */
		updateElements(state, elements) {
			elements.forEach(element => {
				let stateEl = state.elements.find(e => e.id === element.id);

				// Mise à jour d'un élément existant
				if (stateEl) {
					for (let key in element) {
						stateEl[key] = element[key];
					}
				}
				// Ajout d'un élément existant
				else {
					state.elements.push(element);
				}
			});
		},

		/**
		 * Retire des éléments de la liste des éléments chargés
		 * 
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Array} elements Les ID des éléments à retirer
		 */
		removeElements(state, elements) {
			elements.forEach(id => {
				let index = state.elements.findIndex(e => e.id === id);

				if (index !== -1) {
					state.elements.splice(index, 1);
				}
			});
		},

		/**
		 * Met à jour les données de l'élément chargé
		 * 
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} data Liste clé valeur des infos à mettre à jour
		 */
		updateOpened(state, data) {
			for (let key in data) {
				state.openedElement[key] = data[key];
			}
		},

		/**
		 * Enregistre le login dans le store
		 * 
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} login L'objet Login
		 */
		setLogin(state, login) {
			state.login = login;
		},

		/**
		 * Enregistre les structures chargées dans le store
		 * 
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Array} structures La liste des structures
		 */
		setStructures(state, structures) {
			state.structures = structures;
		},

		/**
		 * Enregistre une donnée dubliqué de openedElement
		 * 
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} data Un objet identique à la structure de openedElement
		 */
		tmpElement(state, data) {
			state.tmpElement = data;
		},

		/**
		 * Enregistre la structure active dans le store
		 * 
		 * @param {Object} state Le state de vueX
		 * @param {number} structureId L'id de la structure à activer
		 */
		setStructureId(state, structureId) {
			state.activeStructureId = structureId;
		},

		/**
		 * Enregistre la liste des cellules sélectionnés avec leur valeur
		 * 
		 * @param {Object} state Le state de vueX
		 * @param {Object} oSelectedCells L'id de la structure à activer
		 */
		setSelectedCells(state, oSelectedCells) {
			state.selectedCells = oSelectedCells;
		},

		/**
		 * Enregistre ou modifie la Liste des RessourcesBesoin du projet dans le store
		 * 
		 * @param {Object} state Le state de vueX
		 * @param {Array} optionsRessourcesBesoin
		 * 		-actions	{string}	update, undefined
		 * 		-data		{Array}		Liste des ressources besoins
		 */
		setRessourcesBesoin(state, optionsRessourcesBesoin) {
			if("update" == optionsRessourcesBesoin.action) {
				optionsRessourcesBesoin.data.forEach(besoin => {
					let found = state.ressourcesBesoin.find(e => e.id == besoin.id);
	
					if (found) {
						for (let key in besoin) {
							found[key] = besoin[key]
						}
					} else {
						state.ressourcesBesoin.push(besoin);
					}
				});
			} else {
				state.ressourcesBesoin = optionsRessourcesBesoin;
			}
		},

		/**
		 * Enregistre une liste de ressources rh type dans le store
		 * 
		 * @param {Object} state Le state de vueX
		 * @param {Array} aRessourcesRHType La liste des ressources rh type
		 */
		setRessourcesRHType(state, aRessourcesRHType) {
			state.ressourcesRHType = aRessourcesRHType;
		},


		/**
		 * Enregistre La timeline de l'application
		 * 
		 * @param {Object} state Le state de vueX
		 * @param {Object} oTimeline Object timeline (start, end , now)
		 */
		setTimeline(state, oTimeline) {
			state.timeline = oTimeline;
		},

		/**
		 * Enregistre ou met à jour le state projetList en ajoutant ou retirant les projets.
		 * 
		 * @param {Object} state Le state de vueX
		 * @param {Array} aProjetsListId Liste de projet de
		 */
		setProjetsList(state, aProjetsListId) {			
			/** Ajout les projets sélectionnés manquant a projetsList */
			for(let i in aProjetsListId) {
				let find = state.projetsList.find(projet => projet.id == aProjetsListId[i]);

				if (!find) {
					let oProjet = state.projetsActifs.find(projet => projet.id == aProjetsListId[i])
					state.projetsList.push(oProjet);
				}
			}

			/** retire les projets sélectionnés manquant a projetsList */
			state.projetsList.forEach( (projet, key) => {
				let find = aProjetsListId.find(projetId => projetId == projet.id);

				if (!find) {
					state.projetsList.splice(key, 1);
				}
			});

		},

		/**
		 * Enregistre les projets actifs
		 * @param {Object} state Le state de vueX
		 * @param {Array} aProjets Liste de projets actifs
		 */
		setProjetsActifs(state, aProjets) {
			state.projetsActifs = aProjets;
		},

		/**
		 * 
		 * @param {Object} state Le state de vueX
		 * @param {Object} oPage Liste des pages, avec value a true sur la page en cours
		 */
		setPage(state, oPage) {
			state.page = oPage;
		}
	},

	actions: {
		/**
		 * Charge un élément depuis le store via son ID
		 * @param {Object} context Instance VueX
		 * @param {number} elementId Id de l'élément à charger depuis les éléments existants ou depuis l'API
		 */
		load(context, elementId) {
			let el = context.state.elements.find(e => e.id == elementId);

			if (el) {
				context.commit('open', el);
			}
			else {
				// Il faut générer une requête pour charger l'élément manquant
				console.log('Not found');
			}
		},

		/**
		 * Ferme l'élément ouvert
		 * @param {Object} context Instance VueX
		 */
		unload(context) {
			context.commit('close');
		},

		/**
		 * Met à jour la liste des éléments chargés
		 * @param {Object} context L'instance VueX
		 * @param {Object} payload Les paramètres de rafraichissement
		 * - action			update (default), replace, remove
		 * - elements		la liste des éléments
		 */
		refreshElements(context, payload) {
			if (!('action' in payload)) {
				payload.action = 'update';
			}

			if (payload.action == 'update') {
				context.commit('updateElements', payload.elements);
			}
			else if (payload.action == 'replace') {
				context.commit('replaceElements', payload.elements);
			}
			else if (payload.action == 'remove') {
				context.commit('removeElements', payload.elements);
			}
			else {
				throw new Error(`La mutation ${payload.action} n'existe pas.`);
			}
		},

		/**
		 * Met à jour les infos de l'élément ouvert avec des données
		 * @param {Object} context L'instance vueX
		 * @param {Object} data Liste clé valeur des informations à mettre à jour
		 */
		refreshOpened(context, data) {
			context.commit('updateOpened', data);
		},

		/**
		 * Enregistre l'ouverture d'une session
		 * @param {Object} context L'instance vueX
		 * @param {Object} payload Un objet contenant une clé login et une clé structure
		 */
		login(context, payload) {
			context.commit('setLogin', payload.login);
			context.commit('setStructures', payload.structures);
		},

		/**
		 * Enregistre la fermeture d'une session
		 * @param {Object} context L'instance vueX
		 */
		logout(context) {
			context.commit('setLogin', null);
			context.commit('setStructures', []);
		},

		/**
		 * Bascule sur une structure
		 * @param {Object} context L'instance vueX
		 * @param {integer} payload L'ID de la structure active
		 */
		switchStructure(context, payload) {
			context.commit('close');
			context.commit('tmpElement', null);
			context.commit('replaceElements', []);
			context.commit('setStructureId', payload);
		},

		/**
		 * Ajout une Cell a la Sélection (au tableau SelectionCell)
		 * @param {Object} context L'instance vueX
		 * @param {Object} data Un object contenant la cellule de départ et la cellule de fin
		 */
		refreshSelectedCells(context, data) {
			context.commit('setSelectedCells', data);
		},

		/**
		 * Ajout ou remplace le state ressourcesBesoin
		 * 
		 * @param {Object} context L'instance VueX
		 * @param {Array} ressourcesBesoin 
		 * 		-action		{string}	update
		 * 		-data		{Array}		Liste des ressources dont à besoin un projet
		 */
		refreshRessourcesBesoin(context, ressourcesBesoin) {
			let data = ressourcesBesoin['data'];

			if ('update' == ressourcesBesoin['action']) {
				context.commit('setRessourcesBesoin', {data, action : 'update'});
			} else {
				context.commit('setRessourcesBesoin', data);
			}
		},

		/**
		 * Ajout ou remplace le state ressourcesRHType
		 * 
		 * @param {Object} context L'instance vueX
		 * @param {Array} ressourcesRHType Liste de ressources rh type
		 */
		refreshRessourcesRHType(context, ressourcesRHType) {
			context.commit('setRessourcesRHType', ressourcesRHType);
		},

		/**
		 * Ajout une timeline de l'application
		 * 
		 * @param {Object} context L'instance vueX
		 * @param {Object} timeline object timeline
		 */
		refreshTimeline(context, timeline) {
			context.commit('setTimeline', timeline);
		},
		
		/**
		 * Ajout une liste de projets actifs dans le store
		 * @param {Object} context L'instance vueX
		 * @param {Array} aProjets Liste des projets actifs
		 */
		refreshProjetsActifs(context, aProjets) {
			context.commit('setProjetsActifs', aProjets);
		},
		
		/**
		 * Enregistre les projets sélectionnés
		 * @param {Object} context L'instance vueX
		 * @param {Array} aProjetsListId Liste d'id des projets actifs qui sont séléctionnées
		 */
		refreshProjetsList(context, aProjetsListId) {
			context.commit('setProjetsList', aProjetsListId);
		},

		/**
		 * Enregistre la page en cours a true soit affectation ou ressources 
		 * si tous a false on est sur la home
		 * @param {Obejct} context L'instance VueX
		 * @param {Object} oPage Liste des differents pages avec un value a true pour la page en cours
		 */
		refreshPage(context, oPage) {
			context.commit('setPage', oPage);
		}
	},
	modules: {
	}
})
