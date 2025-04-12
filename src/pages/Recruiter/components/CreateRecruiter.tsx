import CreateRecruiterContainer from '@/containers/create-recruite';
import DashboardContainer from '@/containers/dashboard';
import RecruiterContainer from '@/containers/Recruiter';
import React from 'react';
interface Props {
  isCreate?: boolean;
}
const Recruiter: React.FC<Props> = ({ isCreate = true }) => {
  return <CreateRecruiterContainer isCreate={isCreate} />;
};

export default Recruiter;
