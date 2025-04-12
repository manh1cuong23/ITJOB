import { FC, lazy, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { Navigate, RouteObject } from 'react-router';
import WrapperRouteComponent from './config';
import LayoutPage from '@/components/core/layout';
import { useSelector } from 'react-redux';
import LoginForm from '@/pages/login';
import { TypeUser } from '@/interface/common/type';

const NotFound = lazy(
  () => import(/* webpackChunkName: "404'"*/ '@/pages/404')
);
const BookingPage = lazy(
  () => import(/* webpackChunkName: "booking'"*/ '@/pages/booking')
);
const DashboardPage = lazy(
  () => import(/* webpackChunkName: "dashboard'"*/ '@/pages/dashboard')
);
const JobboardPage = lazy(
  () => import(/* webpackChunkName: "dashboard'"*/ '@/pages/jobBoard')
);
const JobDetailPage = lazy(
  () => import(/* webpackChunkName: "dashboard'"*/ '@/pages/job-detail')
);

const RecruiterPage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/Recruiter')
);
const ProfilePage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/profile')
);
const ApplyJobPage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/apply-job')
);
const InviteJobPage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/invite-job')
);
const ManagementJobPage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/management-job')
);
const CandicatePage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/management-cv')
);
const JobResultPage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/job-result')
);
const CVDetailPage = lazy(
  () => import(/* webpackChunkName: "package-plan'"*/ '@/pages/cv-detail')
);
const CreateRecruiterPage = lazy(
  () =>
    import(
      /* webpackChunkName: "package-plan'"*/ '@/pages/Recruiter/components/CreateRecruiter'
    )
);

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: (
      <WrapperRouteComponent
        element={<LoginForm />}
        // titleId="title.login"
        auth={false}
      />
    ),
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} />,
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
            role={TypeUser.Employer}
            auth={false}
            title="Dashboard"
          />
        ),
      },

      {
        path: 'list-job',
        element: (
          <WrapperRouteComponent
            element={<JobboardPage />}
            title="Dashboard"
            role={TypeUser.User}
            auth={true}
          />
        ),
      },
      {
        path: 'profile',
        element: (
          <WrapperRouteComponent
            element={<ProfilePage />}
            title="Profile"
            role={TypeUser.User}
            auth={true}
          />
        ),
      },
      {
        path: 'apply-jobs',
        element: (
          <WrapperRouteComponent
            element={<ApplyJobPage />}
            title="Profile"
            role={TypeUser.User}
            auth={true}
          />
        ),
      },
      {
        path: 'invite-jobs',
        element: (
          <WrapperRouteComponent
            element={<InviteJobPage />}
            title="Profile"
            role={TypeUser.User}
            auth={true}
          />
        ),
      },
      {
        path: ':id/job-detail',
        element: (
          <WrapperRouteComponent
            role={TypeUser.User}
            auth={true}
            element={<JobDetailPage />}
            title="Dashboard"
          />
        ),
      },
      {
        path: 'recruiter/:id',
        element: (
          <WrapperRouteComponent
            role={TypeUser.User}
            auth={true}
            element={<RecruiterPage />}
            title="Guest Profile"
          />
        ),
      },
      {
        path: 'recruiter/job/create',
        element: (
          <WrapperRouteComponent
            role={TypeUser.Employer}
            auth={true}
            element={<CreateRecruiterPage />}
            title="Guest Profile"
          />
        ),
      },
      {
        path: 'recruiter/job/update/:id',
        element: (
          <WrapperRouteComponent
            role={TypeUser.Employer}
            auth={true}
            element={<CreateRecruiterPage isCreate={false} />}
            title="Guest Profile"
          />
        ),
      },
      {
        path: 'recruiter/management/job',
        element: (
          <WrapperRouteComponent
            role={TypeUser.Employer}
            auth={true}
            element={<ManagementJobPage />}
            title="Guest Profile"
          />
        ),
      },
      {
        path: 'recruiter/candicate',
        element: (
          <WrapperRouteComponent
            role={TypeUser.Employer}
            auth={true}
            element={<CandicatePage />}
            title="Guest Profile"
          />
        ),
      },
      {
        path: 'recruiter/jobs/results/:id',
        element: (
          <WrapperRouteComponent
            role={TypeUser.Employer}
            auth={true}
            element={<JobResultPage />}
            title="Guest Profile"
          />
        ),
      },
      {
        path: 'recruiter/cv/:id/detail',
        element: (
          <WrapperRouteComponent
            role={TypeUser.Employer}
            auth={true}
            element={<CVDetailPage />}
            title="Guest Profile"
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
