import PropTypes from 'prop-types';
import ModernNavbar from './ModernNavbar';

const ModernLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      <main className="font-inter">
        {children}
      </main>
    </div>
  );
};

ModernLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default ModernLayout;
