<template>
    <div class="bg-white admin-wrapper">
        <AdminHeader />
        <!-- <chart :type="type" /> -->
        <div class="row my-3">
            <div class="col-12">
                <div class="d-flex justify-content-between">
                    <div class="form-group">
                        <div class="row" v-if="user.role === 'Admin'">
                            <div class="col-md-7">
                                <div class="p-input-icon-right w-100">
                                    <i class="pi pi-spin pi-spinner" v-if="searchLoading" />
                                    <i class="pi pi-search" v-else />
                                    <InputText type="text" class="w-100" placeholder="Cari riwayat disini" v-model="keyword" />
                                </div>
                            </div>
                            <div class="col-md-5">
                                <Dropdown :filter="true" v-model="type" :options="types" optionLabel="name" placeholder="Pilih Tipe" class="w-100" />
                            </div>
                        </div>
                        <div class="row" v-else>
                            <div class="col-md-12">
                                <div class="p-input-icon-right w-100">
                                    <i class="pi pi-spin pi-spinner" v-if="searchLoading" />
                                    <i class="pi pi-search" v-else />
                                    <InputText type="text" class="w-100" placeholder="Cari riwayat disini" v-model="keyword" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button v-if="barang.barang && barang.totalItems != 0 && barang.length != 0" type="button" label="Unduh Laporan" icon="pi pi-download" iconPos="right" :loading="btnLoading" @click="downloadPdf()"/>
                </div>
                <div class="table-responsive" v-if="barang.barang && barang.totalItems != 0 && barang.length != 0">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col" class="th-1">#</th>
                                <th scope="col" class="th-1"><i class="uil uil-package me-2"></i>Nama</th>
                                <th scope="col" class="th-1"><i class="uil uil-tag-alt me-2"></i>Kategori</th>
                                <th scope="col" class="th-1"><i class="uil uil-list-ul me-2"></i>Tipe</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Tersedia</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Dipakai</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Rusak</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(barang, index) in barang.barang" :key="barang.id">
                                <td class="fw-bold text-center">{{ index+1 }}</td>
                                <td class="text-center"><router-link :to="'/barang/'+barang.id">{{barang.title}}</router-link></td>
                                <td class="text-center">{{barang.category.title}}</td>
                                <td class="text-center">{{barang.type}}</td>
                                <td class="fw-bold text-center">{{barang.tersedia}}</td>
                                <td class="fw-bold text-center">{{barang.dipakai}}</td>
                                <td class="fw-bold text-center">{{barang.rusak}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Message v-else :closable="false" severity="info">Barang belum ditambahkan</Message>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Chart from '@/components/layouts/Chart.vue'
export default {
    data() {
        return {
            keyword: '',
            type: {name: ''},
            types: [
                {name: 'Semua Tipe'},
                {name: 'Dasar'},
                {name: 'Menengah'},
                {name: 'Lanjut'}
            ],
        }
    },
    watch: {
        type() {
            this.getBarang()
        },
        keyword() {
            this.getBarang()
        },
    },
    computed: {
        ...mapGetters({
            barang: 'barang_lab',
            searchLoading: "searchLoading",
            btnLoading: "btnLoading",
            user: 'auth/user',
        }),
    },
    created(){
        this.getBarang()
    },
    components: { Chart, AdminHeader },
    methods: {
        downloadPdf(){
            this.$store.dispatch('downloadPdf',
            {
                type: this.type.name,
                keyword: this.keyword
            }
            )
        },
        getBarang(){
            this.$store.dispatch('allBarang',
            {
                type: this.type.name,
                keyword: this.keyword
            }
            )
        }
    }
}
</script>
<style lang="scss">
@import "@/assets/sass/app.scss";
</style>