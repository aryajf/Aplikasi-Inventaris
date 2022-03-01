import axios from 'axios'
import router from '@/router'

export default{
    namespaced: true,
    state: {
        categories: [],
        category: [],
    },
    mutations: {
        SET_CATEGORIES(state, data){
            state.categories = data
        },
        SET_CATEGORY(state, data){
            state.category = data
        },
        REMOVE_CATEGORY(state, id){
            state.category.splice(state.category.findIndex(function(i){
                return i.id === id;
            }), 1);
        },
    },
    actions: {
        async getCategories({commit}, data){
            try{
                let res
                data.page != null ? res = await axios.get(`category?page=${data.page}`) : res = await axios.get(`category`)
                commit('SET_CATEGORIES', res.data)
                return res.data
            }catch(err){
                return err
            }
        },
        async getCategoriesType({}){
            try{
                let res = await axios.get(`category`)
                return res
            }catch(err){
                return err
            }
        },
        async getCategory({commit}, id){
            try{
                let response = await axios.get(`category/${id}`)
                commit('SET_CATEGORY', response.data.category)
                return response
            }catch(err){
                return err.response
            }
        },
        async searchCategories({commit},data){
            commit('SET_SEARCH_LOADING', true, {root: true})
            try{
                let res
                data.page == null ? res = await axios.get(`category/search/${data.keyword}`) : res = await axios.get(`category/search/${data.keyword}?page=${data.page}`)
                commit('SET_SEARCH_LOADING', false, {root: true})
                commit('SET_CATEGORIES', res.data)
                return res.data
            }catch(err){
                commit('SET_SEARCH_LOADING', false, {root: true})
                return err
            }
        },
        async storeCategory({commit, dispatch}, credentials){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})          
            try{
                let response = await axios.post('category', credentials)
                window.notyf.success(response.data.message)
                commit('SET_BUTTON_LOADING', false, {root: true})        
                router.push('/category')
                dispatch("getCategories", { page: 0 })
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
        async updateCategory({commit, dispatch}, [id, credentials]){
            commit('SET_BUTTON_LOADING', true, {root: true})
            commit('SET_FORM_ERRORS', [], {root: true})          
            try{
                let response = await axios.put(`category/${id}`, credentials)
                window.notyf.success(response.data.message)
                commit('SET_BUTTON_LOADING', false, {root: true})        
                router.push('/category')
                dispatch("getCategories", { page: 0 })
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
        async deleteCategory({state, commit, dispatch}, id){
            commit('SET_BUTTON_LOADING', true, {root: true})
            try{
                let response = await axios.delete(`category/${id}`)
                if(state.category.length == 1){
                    commit('REMOVE_CATEGORY', id)
                }
                dispatch("getCategories", { page: 0 })
                commit('SET_BUTTON_LOADING', false, {root: true})        
                window.notyf.success(response.data.message)
                return response
            }catch(err){
                if(err.response){
                    commit('SET_BUTTON_LOADING', false, {root: true})
                    window.notyf.error(err.response.data.message)
                }
                return err.response
            }
        }
    },
    getters: {
        categories(state){
            return state.categories
        },
        category(state){
            return state.category
        }
    }
}