import React from 'react';

interface Props extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
}

export default function Isotipo(props: Props) {
  const { size = 50 } = props;

  return (
    <svg
      width={size}
      height={size}
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 400 400'
      className='enable-background:new 0 0 400 400;'
      xmlSpace='preserve'
    >
      <g>
        <path
          fill='#00AEF0'
          className='st0'
          d='M35.6,215.8c156-29.4,241.5,5.3,260.8,15.2c61,31.4,57.9,71.5,52.6,86.3c-2.7,7.6-8.1,0.9-8.1,0.9
		S287.6,216.1,35.6,215.8'
        />
        <path
          fill='#F89420'
          className='st1'
          d='M285,284.6c30.7,18.1,39.2,53.3,33.6,65.1c-3.8,8.1-8.5,2.7-8.5,2.7S251.5,283.7,93.4,263
		C204.3,252.2,251,266.1,285,284.6'
        />
        <path
          fill='#fff'
          className='st2'
          d='M140,45.9c0,0,110.6-0.3,120.7,0c33.6-1.9,90.1,22.3,87.8,81.3c-5.2,49.6-44.6,62.5-44.6,62.5
		s58.4,13,60.4,75.1c-49-62.1-150.6-80.1-150.6-80.1s74.7-0.5,75.2-49.8c0.5-46.7-57.1-42.3-57.1-42.3h-35.6v88.6
		c0,0-28.8-7.2-56.3-10.1C139.8,157.7,140,45.9,140,45.9'
        />
      </g>
    </svg>
  );
}
