<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <router-link :to="'/barang/edit/'+url">Update</router-link>
            </div>
            <div class="barang-box">
                <div class="row">
                    {{ barang }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return{
            url: null
        };
    },
    computed: {
        ...mapGetters({
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            barang: "barang/barang",
        }),
    },
    mounted(){
        this.url = this.$route.params.slug;
        this.getBarang()
    },
    created() {
        this.$watch(
            () => this.$route.params,
                () => {
                    this.url = this.$route.params.slug;
                }
            )
    },
    methods: {
        getBarang() {
            this.$store.dispatch("barang/show", this.$route.params.slug)
    },
    }
}
</script>
<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
</style>