import React from 'react';

import { Container } from './styles';

interface RadioGroupProps {
  fieldLabel?: string;
}

const CustomRadioGroup: React.FC<RadioGroupProps> = ({
  fieldLabel,
  children,
}) => {
  return (
    <Container>
      {fieldLabel && <strong>{fieldLabel}</strong>}

      {children}
    </Container>
  );
};

export default CustomRadioGroup;
