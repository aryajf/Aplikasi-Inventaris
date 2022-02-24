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
        async index({commit}, page){
            try{
                let res
                page == null ? res = await axios.get('barang') : res = await axios.get(`barang?page=${page}`)
                commit('SET_ALL_BARANG', res.data)
                commit('SET_ALL_BARANG_SLIDER', res.data)
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
        async search({commit},data){
            commit('SET_BUTTON_LOADING', true, {root: true})
            try{
                let res
                data.page == null ? res = await axios.get(`barang/search/${data}`) : res = await axios.get(`barang/search/${data.keyword}?page=${data.page}`)
                commit('SET_BUTTON_LOADING', false, {root: true})
                commit('SET_ALL_BARANG', res.data)
                return res.data
            }catch(err){
                commit('SET_BUTTON_LOADING', false, {root: true})
                return err
            }
        },
        async create({commit, dispatch}, credentials){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})          
            try{
                 let response = await axios.post('barang', credentials)
                dispatch('index')
                setTimeout(function () {
                    window.notyf.success(response.data.message)
                    commit('SET_BUTTON_LOADING', false, {root: true})        
                    router.push('/barang')
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
        async update({commit, dispatch}, [slug, credentials]){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})
            try{
                await axios.put(`barang/${slug}`, credentials).then(response =>{
                    dispatch('index')
                    setTimeout(function () {
                        window.notyf.success(response.data.message)
                        commit('SET_BUTTON_LOADING', false, {root: true})        
                        router.push('/barang')
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
        async delete({state,commit, dispatch}, slug){
            commit('SET_BUTTON_LOADING', true, {root: true})
            try{
                let response = await axios.delete(`barang/${slug}`)
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(response.data.message)
                if(state.barang.length == 1){
                    commit('REMOVE_BARANG', slug)
                }
                dispatch("index")
                return response
            }catch(err){
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.error(err.response.data.message)
                return err.response
            }
        }
    }
})