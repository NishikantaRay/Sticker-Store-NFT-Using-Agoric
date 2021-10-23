import { mount } from 'enzyme';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import NavDrawer from '../NavDrawer';

jest.mock('../NavMenu', () => () => 'NavMenu');

test('shows the drawer when the button is clicked', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const component = mount(<NavDrawer />);
  component.find(IconButton).simulate('click');

  expect(component.find(Drawer).props().open).toEqual(true);
});

test('hides the button on large viewports', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const component = mount(<NavDrawer />);

  expect(component.find(IconButton).length).toEqual(0);
});
