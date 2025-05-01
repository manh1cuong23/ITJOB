import { TypeUser } from '@/interface/common/type';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RedirectByRole = () => {
  const { role } = useSelector((state: any) => state.auth);

  if (!role) return null; // Hoặc loading indicator

  if (role === TypeUser.Admin) {
    return <Navigate to="/admin/users" replace />;
  }

  if (role === TypeUser.Employer) {
    return <Navigate to="/recruiter/management/job" replace />;
  }

  // Mặc định nếu không khớp
  return <Navigate to="/dashboard" replace />;
};

export default RedirectByRole;
