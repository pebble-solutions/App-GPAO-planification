export default {
    namespaced: true,

    state: {
        ressourcesRHType: [],
        ressourcesRHTypeChecked: []
    },

    mutations: {
        /**
         * Met à jour la liste des ressourcesRHType du state
         * 
         * @param {object} state Le state du module
         * @param {array} ressourcesRHTypeOptions
         *    - mode : 'reset', 'add', 'update', 'remove'
         *    - ressourcesRHType : ressourcesRHType list
         */
        setRessourcesRHType(state, ressourcesRHTypeOptions) 
        {
            let mode = ressourcesRHTypeOptions.mode;
            let ressourcesRHType = ressourcesRHTypeOptions.ressourcesRHType;

            if ("reset" === mode) {
                state.ressourcesRHType = ressourcesRHType;
            } else {
                for (const index in ressourcesRHType) {
                    if ('add' === mode) {
                        state.ressourcesRHType.push(ressourcesRHType[index]);
                    }

                    if ('update' === mode) {
                        let ressourcesRHTypeIndex = state.ressourcesRHType.findIndex(ressourceRHType => ressourceRHType.id === ressourcesRHType[index].id);

                        if (-1 !== ressourcesRHTypeIndex) {
                            state.ressourcesRHType[ressourcesRHTypeIndex] = ressourcesRHType[index];
                        } else {
                            state.ressourcesRHType.push(ressourcesRHType[index]);
                        }
                    }

                    if ('remove' === mode) {
                        let ressourcesRHTypeIndex = state.ressourcesRHType.findIndex(ressourceRHType => ressourceRHType.id === ressourcesRHType[index].id);

                        if (-1 !== ressourcesRHTypeIndex) {
                            state.ressourcesRHType.splice(ressourcesRHTypeIndex, 1);
                        }
                    }
                }
            }
        },

        setRessourcesRHTypeChecked(state, ressourcesRHTypeChecked) 
        {
            state.ressourcesRHTypeChecked = ressourcesRHTypeChecked;
        }
    },

    actions: {
        /**
         * Initialise la liste des ressourcesRHType
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array} ressourcesRHType Liste de ressourcesRHType
         */
        resetRessourcesRHType(context, ressourcesRHType)
        {
            context.commit('setRessourcesRHType', {mode: 'reset', ressourcesRHType: ressourcesRHType});
        },

        /**
         * Ajoute une ressourcesRHType à la liste des ressourcesRHType
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array} ressourcesRHType La ressourcesRHType à ajouter
         */
        addRessourcesRHType(context, ressourcesRHType)
        {
            context.commit('setRessourcesRHType', {mode: 'add', ressourcesRHType: ressourcesRHType});
        },

        /**
         * Met à jour une/des ressourcesRHType de la liste des ressourcesRHType
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array} ressourcesRHType La ressourcesRHType à mettre à jour
         */
        updateRessourcesRHType:
        {
            root: true,
            handler(context, ressourcesRHType) {
                context.commit('setRessourcesRHType', {mode: 'update', ressourcesRHType: ressourcesRHType});
            }

        },

        /**
         * Supprime une ressourcesRHType de la liste des ressourcesRHType
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array} ressourcesRHType La ressourcesRHType à supprimer
         */
        removeRessourcesRHType(context, ressourcesRHType)
        {
            context.commit('setRessourcesRHType', {mode: 'remove', ressourcesRHType: ressourcesRHType});
        },

        /**
         * Met à jour la liste des ressourcesRHTypeChecked du state
         * 
         * @param {object} context Le contexte du store
         * @param {array} ressourcesRHTypeChecked La liste des ressourcesRHTypeChecked 
         */
        refreshRessourcesRHTypeChecked(context, ressourcesRHTypeChecked)
        {
            context.commit('setRessourcesRHTypeChecked', ressourcesRHTypeChecked);
        }
    }
}