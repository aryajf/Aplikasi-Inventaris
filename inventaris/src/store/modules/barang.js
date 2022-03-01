import axios from 'axios'
import router from '@/router'

export default({
    namespaced: true,
    state:{
        all_barang: [],
        barang: [],
    },
    getters: {
        all_barang(state){
            return state.all_barang
        },
        barang(state){
            return state.barang
        },
    },
    mutations: {
        SET_ALL_BARANG(state, data){
            state.all_barang = data
        },
        SET_BARANG(state, data){
            state.barang = data
        },
        REMOVE_BARANG(state, slug){
            state.barang.splice(state.barang.findIndex(function(i){
                return i.slug === slug;
            }), 1);
        },
    },
    actions: {
        async getBarang({commit}, data){
            try{
                let res
                data == null ? res = await axios.get('barang') : res = await axios.get(`barang?page=${data.page}`)
                commit('SET_ALL_BARANG', res.data)
                return res.data
            }catch(err){
                return err
            }
        },
        async show({commit}, slug){
            try{
                let response = await axios.get(`barang/${slug}`)
                commit('SET_BARANG', response.data.barang)
                return response
            }catch(err){
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
                    router.push(`/barang/${response.data.data.slug}`)
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
        async updateBarang({commit, dispatch}, [slug, credentials]){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})
            try{
                await axios.put(`barang/${slug}`, credentials).then(response =>{
                    dispatch('getBarang')
                    setTimeout(function () {
                        window.notyf.success(response.data.message)
                        commit('SET_BUTTON_LOADING', false, {root: true})        
                        router.push(`/barang/${response.data.data.slug}`)
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
        async deleteBarang({state,commit, dispatch}, slug){
            commit('SET_BUTTON_LOADING', true, {root: true})
            try{
                let response = await axios.delete(`barang/${slug}`)
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(response.data.message)
                if(state.barang.length == 1){
                    commit('REMOVE_BARANG', slug)
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