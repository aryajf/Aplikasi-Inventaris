import axios from 'axios'

export default{
    namespaced: true,
    state: {
        users: [],
        user: null
    },
    mutations: {
        SET_USERS(state, data){
            state.users = data
        },
        SET_USER(state, data){
            state.user = data
        },
        DELETE_USERS(state, id){
            state.pending.splice(state.users.findIndex(function(i){
                return i.id === id;
            }), 1);
        },
    },
    actions: {
        async getUsers({commit}, data){
            try{
                let res
                if(data){
                    if(data.page == undefined){
                        data.page = 0
                    }
                    res = await axios.get(`user?&type=${data.type}&page=${data.page}&keyword=${data.keyword}`)
                }else{
                    res = await axios.get(`user`)
                }
                commit('SET_USERS', res.data)
                return res
            }catch(err){
                return err.response
            }
        },
        async showUser({commit}, id){
            try{
                let res = await axios.get(`user/${id}`)
                commit('SET_USER', res.data.user)
                return res
            }catch(err){
                return err.response
            }
        },
        async createUser({commit, dispatch}, credentials){
            commit('SET_FORM_ERRORS', {}, {root: true})
            commit('SET_BUTTON_LOADING', true, {root: true})
            let create = await axios.post('user', credentials).then(res => {
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(res.data.message)
                dispatch('getUsers')
                return res
            }).catch(err => {
                if(err.response.data.errors){
                    commit('SET_FORM_ERRORS', err.response.data.errors, {root: true})
                }
                window.notyf.error(err.response.data.message)
                commit('SET_BUTTON_LOADING', false, {root: true})
                return err.response
            })
            return create
        },
        async deleteUser({state, commit, dispatch}, id){
            commit('SET_BUTTON_LOADING', true, {root: true})
            let deleteUser = await axios.delete(`user/${id}`).then(response => {
                if(state.users.length == 1){
                    commit('DELETE_USERS', id)
                }
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(response.data.message)
                dispatch("getUsers")
                return response
            }).catch(err => {
                if(err.response){
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            })
            return deleteUser
        }
    },
    getters: {
        users(state){
            return state.users
        },
        user(state){
            return state.user
        }
    }
}