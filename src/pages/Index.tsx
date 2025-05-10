
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This is just a redirect to the dashboard page
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
};

export default Index;
