<template>
    <div class="bg-white admin-wrapper">
        <LabHeader />
        <div class="row d-flex justify-content-around">
            <div class="col-12">
                <template v-if="barang.barang && barang.totalItems != 0">
                    <h4 class="text-center my-3">Jumlah Data Barang</h4>
                    <div class="d-flex justify-content-between">
                        <Button type="button" label="Unduh Laporan" icon="pi pi-download" iconPos="right" :loading="btnLoading" @click="downloadPdfShow()"  />
                    </div>
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
                                    <td>{{barang.tersedia}}</td>
                                    <td>{{barang.dipakai}}</td>
                                    <td>{{barang.rusak}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Paginator v-if="barang.totalPages >= 2" @page="changePage($event)" v-model:rows="barang.limitItems" :totalRecords="barang.totalItems" />
                </template>
                <template v-else>
                    <Message :closable="false" severity="info">Barang belum ditambahkan</Message>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import LabHeader from '@/components/layouts/LabHeader.vue'
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
    components: { LabHeader },
    methods: {
        downloadPdfShow(){
            this.$store.dispatch('downloadPdfShow', this.url)
        },
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