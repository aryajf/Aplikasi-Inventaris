<template>
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Konfirmasi Hapus</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Anda yakin ingin menghapusnya?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal" ref="modalClose">Tidak</button>
                    
                    <!-- DELETE BARANG ITEM -->
                    <button :disabled="btnLoading" type="button" class="btn btn-danger btn-sm d-flex" @click="deleteBarang(barang_slug)" v-if="barang_slug != null">
                        Hapus
                        <template v-if="btnLoading">
                            <Pulse />
                        </template>
                    </button>

                    <!-- DELETE USER -->
                    <button :disabled="btnLoading" type="button" class="btn btn-danger btn-sm d-flex" @click="deleteUser(user_id)" v-else-if="user_id != null">
                        Hapus
                        <template v-if="btnLoading">
                            <Pulse />
                        </template>
                    </button>

                    <!-- DELETE CATEGORY -->
                    <button :disabled="btnLoading" type="button" class="btn btn-danger btn-sm d-flex" @click="deleteCategory(category_id)" v-else-if="category_id != null">
                        Hapus
                        <template v-if="btnLoading">
                            <Pulse />
                        </template>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pulse from '@/components/loader/Pulse.vue'
export default {
    props: [
        'barang_slug',
        'user_id',
        'category_id'
    ],
    components: { Pulse },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
        }),
    },
    methods: {
        deleteBarang(slug) {
            this.$store.dispatch('barang/deleteBarang', slug).then((res) => {
                if (res.status === 200) {
                    this.$refs.modalClose.click()
                    this.$router.push('/lab')
                }
            })
        },
        deleteUser(id) {
            this.$store.dispatch('user/deleteUser', id).then((res) => {
                if (res.status === 200) {
                    this.$refs.modalClose.click()
                }
            })
        },
        deleteCategory(id) {
            this.$store.dispatch('category/deleteCategory', id).then((res) => {
                if (res.status === 200) {
                    this.$refs.modalClose.click()
                }
            })
        }
    },
}
</script>

<style>
</style>