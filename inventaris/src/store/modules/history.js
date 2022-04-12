import axios from 'axios'
import router from '@/router'

export default({
    namespaced: true,
    state:{
        history: [],
    },
    getters: {
        history(state){
            return state.history
        },
    },
    mutations: {
        SET_HISTORY(state, status){
            state.history = status
        },
    },
    actions: {
        async history({commit}, data){
            try{
                let res
                if(data){
                if(data.page == undefined){
                    data.page = 0
                }
                res = await axios.get(`history?&type=${data.type}&page=${data.page}&keyword=${data.keyword}`)
                }else{
                    res = await axios.get(`history`)
                }
                commit('SET_HISTORY', res.data)
                return res
            }catch(err){
                return err.response
            }
        },
    }
})