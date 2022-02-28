<template>
    <div class="bg-white admin-wrapper">
        <div class="row d-flex justify-content-around">
            <div class="col-12">
                <h4 class="text-center my-3">Jumlah Data Barang</h4>
                <template v-if="barang.barang && barang.totalItems != 0">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="th-1">#</th>
                                    <th scope="col" class="th-1"><i class="uil uil-package me-2"></i>Nama</th>
                                    <th scope="col" class="th-1"><i class="uil uil-tag-alt me-2"></i>Kategori</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Tersedia</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Terpakai</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Rusak</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(barang, index) in barang.barang" :key="barang.id">
                                    <td class="fw-bold text-center">{{ index+1 }}</td>
                                    <td class="text-center"><router-link :to="'/barang/'+barang.slug">{{barang.title}}</router-link></td>
                                    <td class="text-center">{{barang.category.title}}</td>
                                    <td>{{barang.status}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data(){
        return{
            url: null,
        };
    },
    computed: {
        ...mapGetters({
            barang: "show_lab",
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            user: "auth/user",
        }),
    },
    mounted(){
        this.url = this.$route.params.type;
        this.showAllBarang()
    },
    created() {
        this.$watch(
            () => this.$route.params,
                () => {
                    this.url = this.$route.params.type;
                    this.showAllBarang()
                }
            )
    },
    methods: {
        showAllBarang() {
            this.$store.dispatch('showAllBarang', this.url)
        },
    }
}
</script>
<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
</style>