import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import {
    loginMain,
    loginSub,
    getInfo,
    accountSwitch
} from '@/request/api/login'
import {
    resetRouter
} from '@/router'
const state = {
    token: getToken(),
    userInfo: {},
    roles: [],
    permissions: [],
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
        setToken(token)
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    // SET_USERINFO: (state, userInfo) => {
    //     let {
    //         id,
    //         username,
    //         avatar
    //     } = userInfo;
    //     state.userInfo = {
    //         id,
    //         username,
    //         avatar: avatar ? avatar : "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    //     };
    // },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
        state.permissions = permissions;
    },
}

const actions = {
    // 登录
    login({
        commit
    }, userInfo) {
        const {
            phonenum,
            phonecode,
            password
        } = userInfo
        return new Promise((resolve, reject) => {
            loginMain({
                phonenum: phonenum,
                phonecode: phonecode,
                password: password
            }).then(response => {
                const {
                    data
                } = response
                commit('SET_TOKEN', data.token)
                commit('SET_USERINFO', data)
                delete data.token;
                localStorage.setItem("userInfo", JSON.stringify(data));
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 切换账户
    accountSwitchLogin({
        commit
    }, userInfo) {
        return new Promise((resolve, reject) => {
            accountSwitch({switchUserId:userInfo.userId}).then(response => {
                const {
                    data
                } = response
                
                let dataP={
                    "personname": userInfo.personName,
                    "personheadphoto": userInfo.personHeadPhoto,
                    "usertype": userInfo.type,
                    "purchaseType": 1,
                    "token": data.token,
                    "isSetPayWord":0
                }
                removeToken()
                resetRouter()
                localStorage.removeItem("userInfo");

                commit('SET_TOKEN', dataP.token)
                commit('SET_USERINFO', dataP)
                delete dataP.token;
                localStorage.setItem("userInfo", JSON.stringify(dataP));
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 副账户登录
    loginSub({
        commit
    }, userInfo) {
        const {
            phonenum,
            subPhoneNum,
            password
        } = userInfo
        return new Promise((resolve, reject) => {
            loginSub({
                phoneNum: phonenum,
                subPhoneNum: subPhoneNum,
                password: password
            }).then(response => {
                const {
                    data
                } = response
                commit('SET_TOKEN', data[0].token)
                data[0].personname = data[0].userName
                delete data[0].userName
                delete data[0].token;
                commit('SET_USERINFO', data[0])
                localStorage.setItem("userInfo", JSON.stringify(data[0]));
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    getInfo({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            // getInfo().then(response => {
            let userInfo = JSON.parse(localStorage.getItem("userInfo"));
            commit('SET_USERINFO', userInfo)

            // if (response.data.roles && response.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            //     commit("SET_ROLES", response.data.roles);
            //     commit("SET_PERMISSIONS", response.data.permissions);
            // } else {
            commit("SET_ROLES", ["ROLE_DEFAULT"]);
            // }
            resolve()
            // }).catch(error => {
            //     reject(error)
            // })
        })
    },
    // 退出登录
    logout({
        commit,
        state,
        dispatch
    }) {
        return new Promise((resolve, reject) => {
            removeToken()
            resetRouter()
            localStorage.removeItem("userInfo");
            dispatch('tagsView/delAllViews', null, {
                root: true
            })
            dispatch('permission/clearRouter', null, {
                root: true
            })
            resolve()
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}