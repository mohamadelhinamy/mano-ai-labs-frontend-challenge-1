import React from 'react';
import { Button as MantineButton, ButtonProps } from '@mantine/core';

interface CustomButtonProps extends ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, onClick, ...props }) => {
  return (
    <MantineButton onClick={onClick} {...props}>
      {children}
    </MantineButton>
  );
};

export default CustomButton;
