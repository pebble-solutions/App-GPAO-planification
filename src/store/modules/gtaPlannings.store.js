export default {
    namespaced: true,

    state: {
        gtaPlannings: []
    },

    mutations: {
        /**
         * Met à jour la liste des gta plannings du state
         * 
         * @param {object} state Le state du module
         * @param {array} gtaPlanningOptions 
         *     - mode : 'reset', 'add', 'update', 'remove'
         *     - gtaPlannings : gta plannings list
         */
        setGtaPlannings(state, gtaPlanningsOptions) 
        {
            let mode = gtaPlanningsOptions.mode;
            let gtaPlannings = gtaPlanningsOptions.gtaPlannings;

            if ("reset" === mode) {
                state.gtaPlannings = gtaPlannings;
            } else {
                for (const index in gtaPlannings) {
                    if ('add' === mode) {
                        state.gtaPlannings.push(gtaPlannings[index]);
                    }

                    if ('update' === mode) {
                        let gtaPlanningIndex = state.gtaPlannings.findIndex(gtaPlanning => gtaPlanning.id === gtaPlannings[index].id);

                        if (-1 !== gtaPlanningIndex) {
                            state.gtaPlannings[gtaPlanningIndex] = gtaPlannings[index];
                        } else {
                            state.gtaPlannings.push(gtaPlannings[index]);
                        }
                    }

                    if ('remove' === mode) {
                        let gtaPlanningIndex = state.gtaPlannings.findIndex(gtaPlanning => gtaPlanning.id === gtaPlannings[index].id);

                        if (-1 !== gtaPlanningIndex) {
                            state.gtaPlannings.splice(gtaPlanningIndex, 1);
                        }
                    }
                }
            }
        }
    },

    actions: {
        /**
         * Initialise la liste des gta plannings
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array} gtaPlannings Liste de gta plannings
         */
        resetGtaPlannings(context, gtaPlannings)
        {
            context.commit('setGtaPlannings', {
                mode: 'reset',
                gtaPlannings: gtaPlannings
            });
        },

        /**
         * add 1 or many gta plannings
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array } gtaPlannings Liste de gta plannings
         */
        addGtaPlannings(context, gtaPlannings)
        {
            context.commit('setGtaPlannings', {
                mode: 'add',
                gtaPlannings: gtaPlannings
            });
        },

        /**
         * Mets a jour la liste des gta plannings
         * 
         * @param {Object} context L'instance vuex du moduke$
         * @param {array} gtaPlannings Liste de gta plannings
         */
        updateGtaPlannings(context, gtaPlannings)
        {
            context.commit('setGtaPlannings', {
                mode: 'update',
                gtaPlannings: gtaPlannings
            });
        },

        /**
         * Ajoute 1 ou plusieurs gta plannings
         * 
         * @param {Object} context L'instance vuex du module
         * @param {array} gtaPlannings Liste de gta plannings
         */
        removeGtaPlannings(context, gtaPlannings)
        {
            context.commit('setGtaPlannings', {
                mode: 'remove',
                gtaPlannings: gtaPlannings
            });
        }


    }
};