import { FC, ReactElement, useEffect, useState } from 'react';
import { Navigate, RouteProps, useLocation } from 'react-router-dom';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { TypeUser } from '@/interface/common/type';

const { Text } = Typography;
interface PrivateRouteProps {
  rolePermision?: TypeUser;
  element: ReactElement;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element, rolePermision }) => {
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const accessToken = localStorage.getItem('token');
  const location = useLocation();
  const { role, username } = useSelector(state => state.auth);
  console.log('check role', role);
  useEffect(() => {
    console.log('role pee', role, rolePermision);

    if (!username || !accessToken) {
      setRedirectPath(`/login`);
    }
    if (rolePermision && rolePermision !== role) {
      setRedirectPath(`/login`);
    }
  }, [username, location.pathname, role]);

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
