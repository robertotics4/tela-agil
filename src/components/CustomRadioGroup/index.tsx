import React, {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useField } from '@unform/core';

import { Container } from './styles';

interface State {
  name: string;
  code: string;
}

interface RadioGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  fieldLabel?: string;
  states: State[];
}

const CustomRadioGroup: React.FC<RadioGroupProps> = ({
  name,
  fieldLabel,
  states,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField } = useField(name);

  const handleChange = useCallback(event => {
    console.log(event.target);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);
  return (
    <Container>
      {fieldLabel && <strong>{fieldLabel}</strong>}

      {states.map(state => {
        return (
          <label key={state.code} htmlFor={state.name}>
            <input
              name={name}
              ref={inputRef}
              id={state.name}
              type="radio"
              value={state.code}
              onChange={handleChange}
              {...rest}
            />
            <span>{state.name}</span>
          </label>
        );
      })}
    </Container>
  );
};

export default CustomRadioGroup;
