import { FC, ReactElement, useEffect } from 'react';
import PrivateRoute from './privateRoute';
import { useIntl } from 'react-intl';

interface WrapperRouteComponentProps {
  title?: string;
  auth?: boolean;
  element: ReactElement;
}

const WrapperRouteComponent: FC<WrapperRouteComponentProps> = ({
  title,
  auth,
  ...props
}) => {

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return auth && false? <PrivateRoute {...props} /> : (props.element as ReactElement);
};

export default WrapperRouteComponent;
