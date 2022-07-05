<template>
    <div class="col overflow-auto">
        <AppToolbar class-list="position-sticky" style-list="left:0px; right:0px; z-index:500;" id="main">
            <AppToolbarItem class-list="border-right pr-2 mr-2">
                <form class="form-inline" @submit.prevent="addToSelection">
                    <label for="selectionBesoins" class="mx-1">Pour la selection :</label>
                    <input  type="number" id="selectionBesoins" class="mx-1 form-control" name="selectionBesoins" style="width:120px;" v-model="selectionBesoins">
                    <button class="mx-1 btn btn-outline-secondary" :disabled="pending.ajoutGroup">
                        <span v-if="pending.ajoutGroup" class="spinner-border spinner-border-sm"  role="status"></span>
                        <i class="bi bi-check" v-else></i>
                    </button>
                </form>
            </AppToolbarItem>
    
            <AppToolbarItem>
                <button class="btn btn-outline-secondary ml-2" @click="initGroupModal">Ajout groupé</button>
            </AppToolbarItem>
    
            <!-- <div slot="aside"> -->
            <div>
                <a class="btn btn-primary btn-block layer-full" href="#!ressource/besoins">
                    <i class="fa fa-plus"></i>
                    Métiers
                </a>
            </div>
        </AppToolbar>

        <div class="row">
            <CalendarTimeline :timeline="timeline">

            </CalendarTimeline>
        </div>
    </div>
    
</template>


<script>
import AppToolbar from "@/components/AppToolbar.vue";
import AppToolbarItem from "@/components/AppToolbarItem.vue";
import CalendarTimeline from "@/components/CalendarTimeline.vue";

import '@/js/date.js';

export default {
    data() {
        return{
            pending: {
                ajoutGroup: false
            },
            timeline: {
                start: null,
                end: null,
                now: new Date()
            }
        }
    },

    components: {
        AppToolbar,
        AppToolbarItem,
        CalendarTimeline,
    },

    methods: {
        
    },

    mounted(){
        this.timeline.start = new Date();
        this.timeline.start = this.timeline.start.getMonday();

        this.timeline.end = new Date(this.timeline.start);
        this.timeline.end.setDate(this.timeline.start.getDate() + 28);
    }

}
</script>