// Note: This file is shared with the Widget Developer Dashboard
// Do not import from any other file

export default {
  // 'When enabled, the new Support embed will be displayed instead of the old Submit Ticket embed'
  web_widget_react_router_support: {
    defaultValue: false,
    getArturoValue: state => state.support.config.webWidgetReactRouterSupport
  }
}
