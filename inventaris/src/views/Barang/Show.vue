<template>
    <div>
        <!-- <router-link :to="'/barang/edit/'+this.route.params.id">Update</router-link> -->
        {{ url }}
    </div>
</template>
<script>
export default {
    mounted(){
        this.url = this.$route.params.id;
    },
    data(){
        return{
            url: null
        };
    },
    created() {
    this.$watch(
        () => this.$route.params,
            (toParams, previousParams) => {
                this.url = this.$route.params.id;
            }
        )
    },
}
</script>
<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
</style>