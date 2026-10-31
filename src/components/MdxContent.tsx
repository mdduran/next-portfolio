import * as React from 'react';
import * as runtime from 'react/jsx-runtime';
import { Link, Typography } from '@mui/material';

type MdxComponents = Record<string, React.ComponentType<any>>;
type MdxModule = { default: React.ComponentType<{ components?: MdxComponents }> };

const components: MdxComponents = {
  p: (props) => <Typography component="p" sx={{ mb: 2 }} {...props} />,
  a: (props) => <Link underline="hover" target="_blank" rel="noopener" {...props} />
};

// Evaluates MDX compiled with outputFormat 'function-body' (see src/lib/projects.ts).
// Same as @mdx-js/mdx's runSync, without shipping the compiler to the client.
function runMdx(code: string): MdxModule {
  return new Function(code)({ ...runtime }) as MdxModule;
}

const MdxContent = ({ code }: { code: string }): React.ReactElement => {
  const { default: Content } = React.useMemo(() => runMdx(code), [code]);
  return <Content components={components} />;
};

export default MdxContent;
