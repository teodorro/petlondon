import { Box, List, ListItem } from '@mui/material';
import React, { ReactElement } from 'react';
import { useDrawerStore } from '../../stores/drawer-store';
import { MenuItemNames } from '../../types/menu-item-names';
import { useNavigate } from 'react-router-dom';
// import { useAccidentsQuery } from '../../services/accidents-service';
import { useAllBikePointLocations } from '../../services/bike-point-service';

export default function MenuComp() {
  const drawerStore = useDrawerStore();
  const navigate = useNavigate();
  // const getAccidentsQuery = useAccidentsQuery(2010);
  const getAllBikePointLocations = useAllBikePointLocations();
  console.log(getAllBikePointLocations.data);

  const items = [
    { id: 1, name: MenuItemNames.Test },
    { id: 2, name: MenuItemNames.OpenLayers },
    { id: 3, name: MenuItemNames.D3 },
    { id: 4, name: MenuItemNames.AGgrid },
  ];

  const getNavItem = (name: string): ReactElement => {
    switch (name) {
      case MenuItemNames.OpenLayers:
        return getOpenLayersNavItem();
      case MenuItemNames.D3:
        return getD3NavItem();
      case MenuItemNames.AGgrid:
        return getAgGridNavItem();
      case MenuItemNames.Test:
        return getTestItem();
      default:
        return getUnknownNavItem();
    }
  };

  const getOpenLayersNavItem = () => {
    return getDefaultNavItem(
      MenuItemNames.OpenLayers,
      'openlayers.svg',
      '/openlayers'
    );
  };

  const getD3NavItem = () => {
    return getDefaultNavItem(MenuItemNames.D3, 'd3js.svg', '/d3');
  };

  const getAgGridNavItem = () => {
    return getDefaultNavItem(MenuItemNames.AGgrid, 'ag-grid.png', '/aggrid');
  };

  const getUnknownNavItem = () => {
    return getDefaultNavItem(MenuItemNames.Unknown, 'vite.svg', '');
  };

  const getDefaultNavItem = (name: string, filename: string, path: string) => {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}
        onClick={() => navigate(path)}
      >
        <img src={filename} alt={name} className="w-8 h-8"></img>
        {drawerStore.open && <div className="w-4"></div>}
        {drawerStore.open && name}
      </Box>
    );
  };

  const getTestItem = () => {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}
        onClick={() => testFn()}
      ></Box>
    );
  };

  const testFn = () => {};

  return (
    <List sx={{ ml: 1 }}>
      {items.map((item) => (
        <ListItem key={item.id}>{getNavItem(item.name)}</ListItem>
      ))}
    </List>
  );
}
