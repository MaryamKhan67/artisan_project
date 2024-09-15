import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/artist/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Arts',
    path: '/artist/arts',
    icon: icon('ic_products'),
  },
  {
    title: 'Manage Store',
    path: '/artist/manage-store',
    icon: icon('ic_store'),
  },
  {
    title: 'Manage Orders',
    path: '/artist/manage-orders',
    icon: icon('ic_orders'),
  },
  {
    title: 'Messages',
    path: '/artist/messages',
    icon: icon('ic_messages'),
  },

];

export default navConfig;
