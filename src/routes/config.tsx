import { FC, ReactElement, useEffect } from 'react';
import PrivateRoute from './privateRoute';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { TypeUser } from '@/interface/common/type';

interface WrapperRouteComponentProps {
  title?: string;
  auth?: boolean;
  role?: TypeUser;
  element: ReactElement;
}

const WrapperRouteComponent: FC<WrapperRouteComponentProps> = ({
  title,
  auth = false,
  role,
  ...props
}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return auth ? (
    <PrivateRoute rolePermision={role} {...props} />
  ) : (
    (props.element as ReactElement)
  );
};

export default WrapperRouteComponent;
