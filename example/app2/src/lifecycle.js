export default {
  bootstrap: [
    async (props) => {
      console.log('bootstrap1')
    }
  ],
  mount: async (props) => {
    console.log('mount1')
  },
  unmount: async (props) => {
    console.log('unmount1')
  }
}
