const Tips = {
  install: (vm:any, option: any) => {}
}
Tips.install = function (vm: any, option: any) {
  vm.prototype.$Tips = function (ms: string) {
    this.$store.dispatch('tips', ms)
  }
}

export default Tips
