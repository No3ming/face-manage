import store from '@/store'

export async function gqlError (cb: Function) {
  try {
    await cb()
  } catch (error) {
    if (error.graphQLErrors.length && error.graphQLErrors[0].message.statusCode === 401) {
      store.commit('LOGIN')
    } else {
      store.commit('TIPS', error.message)
    }
  }
}
