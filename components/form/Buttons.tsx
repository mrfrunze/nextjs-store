'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { LuTrash2, LuPenSquare } from 'react-icons/lu';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { SignInButton } from '@clerk/nextjs';

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

const Buttons = ({
  className = '',
  text = 'submit',
  size = 'lg',
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      disabled={pending}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
          Please wait...
        </>
      ):(
        text
      )}
    </Button>
  )
}

export default Buttons