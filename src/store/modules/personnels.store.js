
export default {
    namespaced: true,

    state: {
        personnels: []
    },

    mutations: {
        /**
         * Met à jour la liste des personnels du state
         * 
         * @param {object} state Le state du module
         * @param {array} personnelsOptions 
         *     - mode : 'reset', 'add', 'update', 'remove'
         *     - personnels : Personnels list
         */
        setPersonnels(state, personnelsOptions) 
        {
            let mode = personnelsOptions.mode;
            let personnels = personnelsOptions.personnels;

            if ("reset" === mode) {
                state.personnels = personnels;
            } else {
                for (const index in personnels) {
                    if ('add' === mode) {
                        state.personnels.push(personnels[index]);
                    }

                    if ('update' === mode) {
                        let personnelIndex = state.personnels.findIndex(personnel => personnel.id === personnels[index].id);

                        if (-1 !== personnelIndex) {
                            state.personnels[personnelIndex] = personnels[index];
                        } else {
                            state.personnels.push(personnels[index]);
                        }
                    }

                    if ('remove' === mode) {
                        let personnelIndex = state.personnels.findIndex(personnel => personnel.id === personnels[index].id);

                        if (-1 !== personnelIndex) {
                            state.personnels.splice(personnelIndex, 1);
                        }
                    }
                }
            }
        }
    },

    actions: {
        /**
         * Initialise la liste des personnels
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array} personnels Liste de personnels
         */
        resetPersonnels(context, personnels)
        {
            context.commit('setPersonnels', {
                mode: 'reset',
                personnels: personnels
            });
        },

        /**
         * add 1 or many personnels
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array } personnels Liste de personnels
         */
        addPersonnels(context, personnels)
        {
            context.commit('setPersonnels', {
                mode: 'add',
                personnels: personnels
            });
        },

        /**
         * Mets a jour la liste des personnels
         * 
         * @param {Object} context L'instance vuex du moduke$
         * @param {array} personnels Liste de personnels
         */
        updatePersonnels:
        {
            root: true,
            handler(context, personnels) {
                context.commit('setPersonnels', {
                    mode: 'update',
                    personnels: personnels
                });
                // const moduleName = 'Personnels';
                // const data = {
                //     'mode': 'update',
                //     'data': personnels,
                //     'assetLabel': 'personnels'
                // };

                // commit('setAssets', {moduleName, data});
            }
        },

        /**
         * supprime 1 ou plusieurs personnels
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array} personnels Liste de personnels
         */
        removePersponnels(context, personnels)
        {
            context.commit('setPersonnels', {
                mode: 'remove',
                personnels: personnels
            });
        }


    }
};