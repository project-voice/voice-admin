const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  image: state => state.user.imageUrl,
  name: state => state.user.name
}
export default getters
