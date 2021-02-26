import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactInputMask, { Props } from 'react-input-mask';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface InputProps extends Props {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const OutlineInputMask: React.FC<InputProps> = ({
  name,
  icon: Icon,
  disabled,
  ...rest
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref: any, value: string) {
        ref.setInputValue(value);
      },
      clearValue(ref: any) {
        ref.setInputValue('');
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isErrored={!!error} isDisabled={disabled}>
      {Icon && <Icon size={20} />}

      <ReactInputMask
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        disabled={disabled}
        ref={inputRef}
        {...rest}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#ff5353" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default OutlineInputMask;
