import { FC } from 'react';
import { RouteProps } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PrivateRoute: FC<RouteProps> = (props) => {
  // const { keycloak, initialized } = useKeycloak();

  // if(initialized){
  //   // Ensure keycloak object exists before calling login
  //   if (keycloak?.authenticated) {
  //     localStorage.setItem("token", keycloak.token as string);
  //     return props.element as React.ReactElement;
  //   } else {
  //     keycloak?.login();
  //     return (
  //       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //         <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  //         <Text style={{ marginLeft: 16 }}>Redirecting to login...</Text>
  //       </div>
  //     );
  //   }
  // }
  // else return null;
  return null
};

export default PrivateRoute;
