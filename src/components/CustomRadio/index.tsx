import React, {
  useEffect,
  useRef,
  InputHTMLAttributes,
  useCallback,
} from 'react';
import { useField } from '@unform/core';

import { Container } from './styles';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value: string;
  label?: string;
}

const CustomRadio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  label,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField } = useField(name);

  const handleChange = useCallback(e => {
    console.log(e.target.value);
    console.log(inputRef.current);
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
      <label htmlFor={id}>
        <input
          onChange={handleChange}
          name={name}
          ref={inputRef}
          id={id}
          type="radio"
          value={value}
          {...rest}
        />
        <span>{label}</span>
      </label>
    </Container>
  );
};

export default CustomRadio;
