import Vue from 'vue';
import Vuex, { StoreOptions, ActionContext, GetterTree } from 'vuex'
import Authenticator from "netlify-auth-providers";
import * as Octokat from 'octokat';
import {config} from "./config";

Vue.use(Vuex);

export enum MUTATIONS {
  SET_TOKEN = "SET_TOKEN",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGOUT = "LOGOUT",
}

export enum ACTIONS {
  LOGIN = "LOGIN",
  REQUEST_TOKEN = "REQUEST_TOKEN",
}

const state = (() => {
  const token = localStorage.getItem("token") || "";
  return {
    token: token as string,
    username: "" as string,
    octo: token ? new Octokat({token: token}) : null,
  }})();

type State = typeof state;
type Context = ActionContext<State, {}>;

const mutations = {
  [MUTATIONS.SET_TOKEN](state: State, token: string) {
    state.token = token;
    state.octo = new Octokat({token: token});
    localStorage.setItem("token", state.token);
  },
  [MUTATIONS.LOGIN_SUCCESS](state: State, response: any) {
    state.username = response.login;
  },
  [MUTATIONS.LOGOUT](state: State) {
    state.token = "";
    state.username = "";
    state.octo = null;
    localStorage.clear();
  },
}

const actions = {
  async [ACTIONS.LOGIN](context: Context) {
    if (!context.state.token) {
      return;
    }
    const result = await context.state.octo.user.fetch()
    context.commit(MUTATIONS.LOGIN_SUCCESS, result);
    return result;
  },

  async [ACTIONS.REQUEST_TOKEN](context: Context) {
    const authenticator = new Authenticator({site_id: config.NETLIFY_SITE_ID});
    const token = await new Promise((resolve, reject) => {
      authenticator.authenticate({provider: "github", scope: "public_repo"}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.token);
        }
      });
    });
    context.commit(MUTATIONS.SET_TOKEN, token);
  }
}

const getters: GetterTree<State, {}> = {
  isLoggedIn(state: State): boolean {
    return !!state.username;
  },
}

const store: StoreOptions<State> = {
  state,
  mutations,
  actions,
  getters,
  strict: process.env.NODE_ENV !== 'production'
};

export default new Vuex.Store<State>(store);

