import axios from 'axios'
import router from '@/router'

export default({
    namespaced: true,
    state:{
        all_barang: [],
        barang_dasar: [],
        barang_menengah: [],
        barang_lanjut: [],
        barang: [],
    },
    getters: {
        all_barang(state){
            return state.all_barang
        },
        barang(state){
            return state.barang
        },
        barang_dasar(state){
            return state.barang_dasar
        },
        barang_menengah(state){
            return state.barang_menengah
        },
        barang_lanjut(state){
            return state.barang_lanjut
        },
    },
    mutations: {
        SET_ALL_BARANG(state, data){
            state.all_barang = data
        },
        SET_ALL_BARANG_DASAR(state, data){
            state.barang_dasar = data
        },
        SET_ALL_BARANG_MENENGAH(state, data){
            state.barang_menengah = data
        },
        SET_ALL_BARANG_LANJUT(state, data){
            state.barang_lanjut = data
        },
        SET_BARANG(state, data){
            state.barang = data
        },
        REMOVE_BARANG(state, id){
            state.barang.splice(state.barang.findIndex(function(i){
                return i.id === id;
            }), 1);
        },
    },
    actions: {
        async getBarang({commit, rootGetters}, data){
            try{
                let res
                data == null ? res = await axios.get('barang') : res = await axios.get(`barang?page=${data.page}`)
                if(rootGetters['auth/authenticated'].role === 'Admin'){
                    if(res.data.barang.length != 0){
                        commit('SET_ALL_BARANG_DASAR', res.data.barang.filter((barang) => barang.type == 'Dasar'))
                        commit('SET_ALL_BARANG_MENENGAH', res.data.barang.filter((barang) => barang.type == 'Menengah'))
                        commit('SET_ALL_BARANG_LANJUT', res.data.barang.filter((barang) => barang.type == 'Lanjut'))
                    }
                }
                commit('SET_ALL_BARANG', res.data)
                return res.data
            }catch(err){
                return err
            }
        },
        async show({commit}, id){
            try{
                let response = await axios.get(`barang/${id}`)
                commit('SET_BARANG', response.data.barang)
                return response
            }catch(err){
                router.push({name: 'Not Found'})
                return err.response
            }
        },
        async storeBarang({commit, dispatch}, credentials){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})          
            try{
                let response = await axios.post('barang', credentials)
                dispatch('getBarang')
                setTimeout(function () {
                    window.notyf.success(response.data.message)
                    commit('SET_BUTTON_LOADING', false, {root: true})        
                    router.push(`/barang/${response.data.data.id}`)
                }, 3000)
                return response
            }catch(err){
                if(err.response){
                    if(err.response.data.errors){
                        commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                    }
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            }
        },
        async updateBarang({commit, dispatch}, [id, credentials]){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})
            try{
                await axios.put(`barang/${id}`, credentials).then(response =>{
                    dispatch('getBarang')
                    setTimeout(function () {
                        window.notyf.success(response.data.message)
                        commit('SET_BUTTON_LOADING', false, {root: true})        
                        router.push(`/barang/${response.data.data.id}`)
                    }, 3000)
                    return response
                })
            }catch(err){
                if(err.response){
                    if(err.response.data.errors){
                        commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                    }
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            }
        },
        async updateStok({commit, dispatch}, [id, credentials]){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})
            try{
                await axios.put(`barang/stok/${id}`, credentials).then(response =>{
                    dispatch('getBarang')
                    dispatch('show', id)
                    window.notyf.success(response.data.message)
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    return response
                })
            }catch(err){
                if(err.response){
                    if(err.response.data.errors){
                        commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                    }
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            }
        },
        async deleteBarang({state,commit, dispatch}, id){
            commit('SET_BUTTON_LOADING', true, {root: true})
            try{
                let response = await axios.delete(`barang/${id}`)
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(response.data.message)
                if(state.barang.length == 1){
                    commit('REMOVE_BARANG', id)
                }
                dispatch("getBarang")
                return response
            }catch(err){
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
                return err.response
            }
        }
    }
})