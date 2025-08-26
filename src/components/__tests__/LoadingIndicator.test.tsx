import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingIndicator from '../LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders without crashing', () => {
    const component = render(<LoadingIndicator />);
    expect(component).toBeTruthy();
  });

  it('displays loading text', () => {
    const { getByText } = render(<LoadingIndicator />);
    expect(getByText('Cargando...')).toBeTruthy();
  });

  it('renders with custom text when provided', () => {
    const { getByText } = render(<LoadingIndicator text="Custom Loading" />);
    expect(getByText('Custom Loading')).toBeTruthy();
  });
});