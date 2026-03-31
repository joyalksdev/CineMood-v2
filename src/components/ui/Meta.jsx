import { Helmet } from 'react-helmet-async';

const Meta = ({ title , customTitle=null }) => {
  const siteName = "CineMood";
  
  const fullTitle = title ? `${siteName} • ${title}` : `${siteName} • Neural Discovery`;
  
    const displayTitle = customTitle 
      ? customTitle 
      : fullTitle
    

  return (
    <Helmet>
      <title>{displayTitle}</title>
    </Helmet>
  );
};

export default Meta;

