import axios from 'axios'
import router from '@/router'

export default({
    namespaced: true,
    state:{},
    getters: {},
    mutations: {},
    actions: {
        async update({commit, dispatch}, data){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})
            let update = await axios.put(`status/${data.id}`, {stok:data.stok}).then(response =>{
                dispatch('barang/getBarang', null, { root: true })
                commit('SET_BUTTON_LOADING', false, {root: true})
                window.notyf.success(response.data.message)
                return response
            }).catch(err => {
                if(err.response){
                    if(err.response.data.errors){
                        commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                    }
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            })

            return update
        },
    }
})