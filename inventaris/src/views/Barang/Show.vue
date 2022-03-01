<template>
    <div>
        <DeleteModal v-if="barang" :barang_slug="barang.slug"></DeleteModal>
        <div class="container-fluid" v-if="barang">
            <div class="barang-box mb-3 bg-light rounded-top">
                <div v-if="user.role === 'Asisten'" class="d-flex justify-content-between align-items-center mb-2">
                    <router-link :to="'/barang/edit/'+url">Ubah Barang</router-link>
                    <a href="#" class="text-danger fs-4" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="uil uil-trash-alt"></i></a>
                </div>
                <div class="row">
                    <div class="col-md-4 col-12">
                        <img v-if="barang.gambar" :src="`${apiURL}images/barang/${barang.gambar}`" class="w-100" alt="gambar">
                        <img v-else src="@/assets/images/image-not-available.png" class="w-100" alt="gambar">
                    </div>
                    <div class="col-md-8 col-12 barang-box-heading">
                        <div class="d-flex justify-content-between align-items-center">
                            <h2>{{barang.title}}</h2>
                            <h5 v-if="barang.category">{{barang.category.title}}</h5>
                        </div>
                        <p class="mt-1" v-html="barang.description"></p>
                    </div>
                </div>
                <div class="row mt-5" v-if="barang.status">
                    <div class="col-md-4 col-12 mb-3">
                        <div class="count-box d-flex justify-content-between align-items-center bg-az">
                            <div>Total Stok Lab Dasar</div>
                            <div class="stock">{{ dasar_count }}</div>
                        </div>
                    </div>
                    <div class="col-md-4 col-12 mb-3">
                        <div class="count-box d-flex justify-content-between align-items-center bg-purple">
                            <div>Total Stok Lab Menengah</div>
                            <div class="stock">{{ menengah_count }}</div>
                        </div>
                    </div>
                    <div class="col-md-4 col-12 mb-3">
                        <div class="count-box d-flex justify-content-between align-items-center bg-ed">
                            <div>Total Stok Lab Lanjut</div>
                            <div class="stock">{{ lanjut_count }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="barang-box bg-light rounded-top" v-if="barang.status">
                <div class="row">
                        <div class="col-md-4 mb-3" v-for="status of barang.status" :key="status.id">
                            <div><label for="withoutgrouping">Stok {{ status.status }} Lab {{ status.location }}</label></div>
                            <InputNumber v-if="user.role === 'Asisten'" class="w-100" id="withoutgrouping" v-on:keyup.enter="updateStok(status.id, status.stok)" v-model="status.stok" mode="decimal" :placeholder="'Stok '+status.status+' Lab '+status.location" :useGrouping="false" />
                            <div v-else>{{status.stok}}</div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import DeleteModal from '@/components/modals/Delete.vue'
import { mapGetters } from "vuex"
import config from "@/config/app"
export default {
    data(){
        return{
            apiURL: config.apiURL,
            url: null,
            dasar_count: 0,
            menengah_count: 0,
            lanjut_count: 0,
        };
    },
    components: {DeleteModal},
    computed: {
        ...mapGetters({
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            barang: "barang/barang",
            user: "auth/user",
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
                    this.getBarang()
                }
            )
    },
    methods: {
        getBarang() {
            this.$store.dispatch("barang/show", this.$route.params.slug).then(res => {
                this.dasar_count = 0
                this.menengah_count = 0
                this.lanjut_count = 0
                if(res.data.barang){
                    res.data.barang.status.map((status) => {
                        if(status.location == 'Dasar') this.dasar_count += status.stok
                        if(status.location == 'Menengah') this.menengah_count += status.stok
                        if(status.location == 'Lanjut') this.lanjut_count += status.stok
                    })
                }
            })
        },
        updateStok(id, stok){
            let data = {
                id: id,
                stok: stok
            }
            this.$store.dispatch("status/update", data).then(res => {
                if(res.status === 201){
                    this.getBarang()
                }
            })
        }
    }
}
</script>
<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
@import '@/assets/sass/barang.scss';
</style>