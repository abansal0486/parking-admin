// assets
import { TeamOutlined, FileDoneOutlined, ProjectOutlined  } from '@ant-design/icons';

// icons
const icons = {
  TeamOutlined,
  FileDoneOutlined,
  ProjectOutlined 
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'pages',
  title: '',
  type: 'group',
  children: [
    {
      id: 'members',
      title: 'Members',
      type: 'item',
      url: '/members',
      icon: icons.TeamOutlined 
    },
     {
      id: 'tickets',
      title: 'Registered Vehicles',
      type: 'item',
      url: '/tickets',
      icon: icons.FileDoneOutlined  
    },
    {
      id: 'buildings',
      title: 'Buildings',
      type: 'item',
      url: '/buildings',
      icon: icons.ProjectOutlined 
    },
    {
      id: 'profile',
      title: 'Profile',
      type: 'item',
      url: '/profile',
      icon: icons.TeamOutlined 
    }
  ]
};

export default pages;
