export default {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/regenerate',
      handler: 'controller.regenerate',
    },
  ],
};
