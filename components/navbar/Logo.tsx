import Link from 'next/link';
import React from 'react'
import { FaShopify } from "react-icons/fa";
import { Button } from '../ui/button';


type Props = {}

function Logo({}: Props) {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <FaShopify className='w-6 h-6' />
      </Link>
    
    </Button>
  )
}

export default Logo