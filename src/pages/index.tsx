import React from 'react';
import { SEO } from 'src/components';
import { baseStyle } from 'src/styles';
import TopMDX from 'src/internal/top.mdx';

import styled from '@emotion/styled';

const Component: React.FCX = ({ className }) => (
  <main className={className}>
    <TopMDX />
  </main>
);

const StyledComponent = styled(Component)`
  ${baseStyle}
`;

export default ({ path }: { path: string }): JSX.Element => (
  <>
    <SEO title='Top' pathname={path} />
    <StyledComponent />
  </>
);
