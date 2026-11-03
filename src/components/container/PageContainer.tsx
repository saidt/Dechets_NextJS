import { JSX } from "react";

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, children }: Props) => (
  <div>
    <title>{title}</title>
    {children}
  </div>
);

export default PageContainer;