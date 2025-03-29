import { FC, lazy, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { Navigate, RouteObject } from 'react-router';
import WrapperRouteComponent from './config';
import LayoutPage from '@/components/core/layout';
import { useSelector } from 'react-redux';

const NotFound = lazy(
  () => import(/* webpackChunkName: "404'"*/ '@/pages/404')
);
const BookingPage = lazy(
  () => import(/* webpackChunkName: "booking'"*/ '@/pages/booking')
);
const DashboardPage = lazy(
  () => import(/* webpackChunkName: "dashboard'"*/ '@/pages/dashboard')
);

const GuestProfilePage = lazy(
  () =>
    import(/* webpackChunkName: "room-avaibility'"*/ '@/pages/guest-profile')
);
const ServicePage = lazy(
  () => import(/* webpackChunkName: "room-avaibility'"*/ '@/pages/service')
);

const AllotmentPage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/allotment')
);

const AllotmentReportPage = lazy(
  () =>
    import(/* webpackChunkName: "package-plan'"*/ '@/pages/allotment-report')
);

const routeList: RouteObject[] = [
  // {
  //   path: '/login',
  //   element: (
  //     <WrapperRouteComponent
  //       element={<LoginForm />}
  //       // titleId="title.login"
  //       auth={false}
  //     />
  //   ),
  // },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} auth={true} />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'dashboard',
        element: (
          <WrapperRouteComponent
            element={<DashboardPage />}
            title="Dashboard"
          />
        ),
      },

      {
        path: 'guest-profile',
        element: (
          <WrapperRouteComponent
            element={<GuestProfilePage />}
            title="Guest Profile"
          />
        ),
      },
      {
        path: 'service',
        element: (
          <WrapperRouteComponent element={<ServicePage />} title="Service" />
        ),
      },

      {
        path: 'booking',
        element: (
          <WrapperRouteComponent element={<BookingPage />} title="Booking" />
        ),
      },

      {
        path: 'allotment',
        element: (
          <WrapperRouteComponent
            element={<AllotmentPage />}
            title="Allotment"
          />
        ),
      },
      {
        path: 'allotment-report',
        element: (
          <WrapperRouteComponent
            element={<AllotmentReportPage />}
            title="Allotment Report"
          />
        ),
      },

      {
        path: '*',
        element: (
          <WrapperRouteComponent
            element={<NotFound />}
            title="Không tìm thấy"
          />
        ),
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const { role } = useSelector(state => state.user);
  const [routes, setRoute] = useState<any[]>(routeList);

  useEffect(() => {
    if (role === 'admin') {
      setRoute(routeList);
    }
  }, [role]);

  const element = useRoutes(routes);
  return element;
};

export default RenderRouter;
